const express = require("express");
const router = express.Router();
const { Article } = require("../../models");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const condition = {
      order: [["id", "DESC"]],
    };
    const articles = await Article.findAll(condition);
    res.json({
      status: true,
      message: "Get Articles List Successfully",
      data: {
        articles,
      },
    });
  } catch (error) {
    res.json({
      status: false,
      message: "Some error happen",
      errors:[error.message]
    });
  }
});

module.exports = router;
