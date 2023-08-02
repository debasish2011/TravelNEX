const express = require("express");
const {isAgentLoggedIn, isUserLoggedIn} = require("../middleware/isLoggedIn");
const controller = require("../controller/dashboardController");

const router = express.Router();

// dashboard page
router.get("/dashboardUser", isUserLoggedIn, controller.dashboardUser);

// dashboard page
router.get("/dashboardAgent", isAgentLoggedIn, controller.dashboardAgent);

module.exports = router;
