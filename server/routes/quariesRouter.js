const express = require("express");
const Quaries = require("../../models/Quaries");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let { name, email, subject, message } = req.body;
    let quary = new Quaries({ name, email, subject, message });
    await quary.save();
    res.status(200).redirect("/success");
  } catch (error) {
    res.status(404).redirect("/opps");
  }
});

module.exports = router;
