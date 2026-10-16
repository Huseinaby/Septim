require('dotenv').config();

const express = require('express');
const userRouter = require('./routes/users');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Archive API'
  });
});

app.use('/api/users', userRouter);



app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});