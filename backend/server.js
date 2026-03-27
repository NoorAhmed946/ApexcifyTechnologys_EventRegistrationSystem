const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config(); // loading variables
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});                                                                                                                                             