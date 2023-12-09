const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const requireLogin = require("../middlewares/requireLogin");

router.get("/", (req, res) => {
  res.send("HELLO Kennect server!");
});

router.get("/protected", requireLogin, (req, res) => {
  res.send("Hello User");
});

router.post("/register", (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    // code 422 - server has understood the request but couldn't process the same
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({
          error: "User with that email already exists. Please Sign in.",
        });
      }

      bcrypt.hash(password, 16).then((hashedPassword) => {
        const user = new User({
          name: name, // if key and value are both same then we can condense it to just name, email, etc.
          email: email,
          password: hashedPassword,
        });

        user
          .save()
          .then((user) => {
            res
              .status(200)
              .json({ message: "User Created Successfully!", data: user });
          })
          .catch((err) => {
            console.log(`Error saving user - ${err}`);
          });
      });
    })
    .catch((err) => {
      console.log(`Error in email findOne - ${err}`);
    });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "Please enter email or password" });
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password 1" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        // doMatch is a boolean value
        if (doMatch) {
          const { _id, name, email } = savedUser;
          const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET
          );
          res.json({ token: token, user: { _id, name, email } });
        } else {
          return res.status(422).json({ error: "Invalid email or password 2" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
