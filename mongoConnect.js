const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "./.env" });

// MongoDB connection string
const mongoLink = process.env.mongoLink;

// Connect to MongoDB
const connectMongo = async () => {
  mongoose
    .connect(mongoLink, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectMongo;
