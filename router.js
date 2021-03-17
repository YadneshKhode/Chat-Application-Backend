const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1> Server is up and running </h1>").status(200);
});
router.get("*", (req, res) => {
  res.send("<h1> Please go to https://yadnesh-chat-app.netlify.app/ </h1>").status(200);
});

module.exports = router;
