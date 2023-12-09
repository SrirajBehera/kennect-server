const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const Post = mongoose.model("Post");

router.get("/allposts", requireLogin, (req, res) => {
  Post.find() // no conditions here so we get all the posts
    .populate("postedBy", "_id name") // to populate the postedBy field, 2nd parameter is to populate the postedBy conditionally
    .populate("comments.postedBy", "_id name")
    .sort({ created_at: -1 })
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  console.log(req.body);
  const { content } = req.body;
  if (!content) {
    return res.status(422).json({ error: "Post cannot be empty!" });
  }

  req.user.password = undefined;

  const post = new Post({
    content: content,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  console.log("comment: ", comment);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .then((result) => {
      res.json({ updatedPost: result });
    })
    .catch((err) => {
      res.status(422).json({ error: err });
    });
});

router.get("/search", requireLogin, async (req, res) => {
  try {
    const searchText = req.query.q;

    // Using the $or operator to search for documents with matching text or content in posts or comments
    const searchResults = await Post.find({
      $or: [
        { text: { $regex: searchText, $options: "i" } }, // Case-insensitive regex search on 'text' in posts
        { content: { $regex: searchText, $options: "i" } }, // Case-insensitive regex search on 'content' in posts
        {
          comments: {
            $elemMatch: {
              text: { $regex: searchText, $options: "i" },
            },
          },
        },
      ],
    })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json({ results: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
