const mongoose = require("mongoose");

const connectionParams = {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
};

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.qhdjybw.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(connectionString, connectionParams)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

module.exports = mongoose;
