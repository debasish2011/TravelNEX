const express = require("express");
const controller = require("../controller/agentAuthContoller");
const passport = require("passport");
const passportconfig = require("../middleware/passport-config");
const Agent = require("../../models/Agent");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");

require("dotenv").config({ path: "../../.env"});

const router = express.Router();
passportconfig(passport);

const host = process.env.host;

// register page
router.get("/register", controller.register);

// login page
router.get("/login", controller.login);

// forgot username page
router.get("/forgotusername", controller.forgotusername);

// forgot password page
router.get("/forgotpassword", controller.forgotpassword);

// reset password page
router.get(
  "/resetpassword/:token",
  async (req, res, next) => {
    try {
      const token = req.params.token;
      let agentdata = await Agent.findOne({ token: token });
      if (!agentdata) {
        res.status(200).redirect("/opps");
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(200).redirect("/opps");
    }
  },
  controller.resetpassword
);

// Register
router.post(
  "/register",
  passport.authenticate("register-agent", {
    successRedirect: "/success",
    failureRedirect: "/opps",
  })
);

// Login
router.post(
  "/login",
  passport.authenticate("login-agent", {
    successRedirect: "/dashboardAgent",
    failureRedirect: "/opps",
  })
);

// Forgot Username
router.post("/forgotusername", async (req, res) => {
  try {
    let agentdata = await Agent.findOne({ email: req.body.email });
    if (agentdata) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });
      const mailOptions = {
        from: "noreply@email.com",
        to: agentdata.email,
        subject: "Forgot Username",
        html: `<h1>Your username is ${agentdata.username}</h1>`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).redirect("/success");
        }
      });
    } else {
      res.status(200).redirect("/opps");
    }
  } catch (error) {
    console.log(error);
  }
});

// Forgot password
router.post("/forgotpassword", async (req, res) => {
  try {
    let agentdata = await Agent.findOne({ email: req.body.email });
    if (agentdata) {
      const token = randomstring.generate();
      agentdata.token = token;
      await agentdata.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });
      const mailOptions = {
        from: "noreply@email.com",
        to: agentdata.email,
        subject: "Reset Password",
        html: `<h1>Click <a href="${host}/api/agents/resetpassword/${token}">here</a> to reset your password</h1>`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).redirect("/success");
        }
      });
    } else {
      res.status(200).redirect("/opps");
    }
  } catch (error) {
    console.log(error);
  }
});

// Reset Password
router.post("/resetpassword/:token", async (req, res) => {
  try {
    let newpassword = req.body.password;
    const token = req.params.token;
    let agentdata = await Agent.findOne({ token: token });
    const salt = await bcrypt.genSalt(10);
    newpassword = await bcrypt.hash(newpassword, salt);
    agentdata.password = newpassword;
    agentdata.token = "";
    await agentdata.save();
    res.status(200).redirect("/success");
  } catch (error) {
    console.log(error);
    res.status(200).redirect("/opps");
  }
});

// Verify Email
router.get("/verify/:token", async (req, res) => {
  try {
    let agent = await Agent.findOne({ token: req.params.token });
    if (agent) {
      agent.verified = true;
      agent.token = "";
      await agent.save();
      res.status(200).redirect("/success");
    } else {
      res.status(200).redirect("/opps");
    }
  } catch (error) {
    console.log(error);
    res.status(200).redirect("/opps");
  }
});


module.exports = router;
