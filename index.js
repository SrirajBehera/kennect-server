const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const db = require("./database");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//cors
const cors = require("cors");
app.use(cors({ origin: '*' }));

app.use(express.json());

require('./models/user');
db.model("User");

require('./models/post');
db.model("Post");

app.use(require('./routes/auth'));
app.use(require('./routes/post'));

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`The Server is running on port: ${process.env.PORT}`);
})