
require('dotenv').config();

const readline = require('node:readline');
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function askPassword(question) {
  return new Promise((resolve, reject) => {
    const input = process.stdin;

    if (!input.isTTY || !input.setRawMode) {
      reject(new Error('Jalankan script dari terminal interaktif.'));
      return;
    }

    let password = '';
    process.stdout.write(question);
    input.setRawMode(true);
    input.resume();

    function cleanup() {
      input.removeListener('data', onData);
      input.setRawMode(false);
      input.pause();
    }

    function onData(data) {
      for (const char of data.toString('utf8')) {
        if (char === '\u0003') {
          cleanup();
          process.stdout.write('\n');
          reject(new Error('Pembuatan akun dibatalkan.'));
          return;
        }

        if (char === '\r' || char === '\n') {
          cleanup();
          process.stdout.write('\n');
          resolve(password);
          return;
        }

        if (char === '\u007f' || char === '\b') {
          password = password.slice(0, -1);
        } else {
          password += char;
        }
      }
    }

    input.on('data', onData);
  });
}

async function main() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL belum diatur di .env');
    }

    const username = (await ask('Username: ')).trim();
    const email = (await ask('Email: ')).trim().toLowerCase();
    const password = await askPassword('Password: ');

    if (!username || !email || !password) {
      throw new Error('Semua input wajib diisi.');
    }

    if (password.length < 8) {
      throw new Error('Password minimal 12 karakter.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, hashedPassword]
    );

    console.log('\nAkun berhasil dibuat:');
    console.log(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      console.error('Username atau email sudah digunakan.');
    } else {
      console.error('Gagal membuat akun:', error.message);
    }

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
