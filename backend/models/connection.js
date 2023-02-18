const mongoose = require('mongoose');
require('dotenv').config();

const DB_KEY = process.env.DB_KEY;

const connectionString = DB_KEY;

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
