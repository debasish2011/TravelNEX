const express = require("express");
const controller = require("../controller/homepageController");
const Quary = require("../../models/Quaries");
const Newsletter = require("../../models/Subscriber");
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

const router = express.Router();

router.get("/", isLoggedOut, controller.home);

module.exports = router;
