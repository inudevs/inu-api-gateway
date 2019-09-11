import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
  path: './env/.secret.env',
});

const PORT = process.env.PORT || 5000;

// mongodb 연결
mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost:27017/test',
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      throw err;
    }
    console.log('Conncected to mongodb');
  },
);

app.listen(
  PORT,
  () => console.log(`Listening on: http://localhost:${PORT}`)
);
