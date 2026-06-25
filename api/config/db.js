const mongoose = require('mongoose');

const connectWithDB = () => {
  const uri = process.env.DB_URL;
  if (!uri) {
    console.log('DB_URL not set');
    process.exit(1);
  }
  mongoose.set('strictQuery', false);
  mongoose
    .connect(uri)
    .then(() => console.log(`DB connected successfully`))
    .catch((err) => {
      console.log(`DB connection failed`);
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectWithDB;
