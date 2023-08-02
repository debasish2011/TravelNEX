const express = require("express");
const passport = require("passport");
const controller = require("../controller/userAuthController");
const passportconfig = require("../middleware/passport-config");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const User = require("../../models/User");
require("dotenv").config({ path: "../../.env"});

passportconfig(passport);
const router = express.Router();

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
      let userdata = await User.findOne({ token: token });
      if (!userdata) {
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
  passport.authenticate("register-user", {
    successRedirect: "/success",
    failureRedirect: "/opps",
  })
);

// Login
router.post(
  "/login",
  passport.authenticate("login-user", {
    successRedirect: "/dashboardUser",
    failureRedirect: "/opps",
  })
);

// Forgot Username
router.post("/forgotusername", async (req, res) => {
  try {
    let email = req.body.email;
    let userdata = await User.findOne({ email: email });
    if (userdata) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });
      const mailOptions = {
        from: "noreply@email.com",
        to: email,
        subject: "Forgot Username",
        html: `<h1>Your username is ${userdata.username}</h1>`,
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
    let userdata = await User.findOne({ email: req.body.email });
    if (userdata) {
      const token = randomstring.generate();
      userdata.token = token;
      await userdata.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });
      const mailOptions = {
        from: "noreply@email.com",
        to: userdata.email,
        subject: "Reset Password",
        html: `<h1>Click <a href="${host}/api/users/resetpassword/${token}">here</a> to reset your password</h1>`,
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
    let userdata = await User.findOne({ token: token });
    newpassword = await bcrypt.hash(newpassword, 10);
    userdata.password = newpassword;
    userdata.token = "";
    await userdata.save();
    res.status(200).redirect("/success");
  } catch (error) {
    console.log(error);
    res.status(200).redirect("/opps");
  }
});

// Verify Email
router.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    let user = await User.findOne({ token: token });
    if (user) {
      user.verified = true;
      user.token = "";
      await user.save();
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
