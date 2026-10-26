require('dotenv').config();

const express = require('express');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Archive API'
  });
});

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});