const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../../models/User");
const Agent = require("../../models/Agent");
const randomstring = require("randomstring");
require("dotenv").config({ path: "../../.env" });

const host = process.env.host;

const passportconfig = () => {
  passport.use(
    "register-user",
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let user = await User.findOne({ username: username });
          if (user) {
            return done(null, false, { message: "Username already taken" });
          }
          let salt = await bcrypt.genSalt(10);
          password = await bcrypt.hash(password, salt);
          let token = randomstring.generate();
          let newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: username,
            email: req.body.email,
            password: password,
            token: token,
          });
          await newUser.save();
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.user,
              pass: process.env.pass,
            },
          });
          const mailOptions = {
            from: "noreply@email.com",
            to: newUser.email,
            subject: "Welcome to our website",
            html: `<h1>Click <a href="${host}/api/users/verify/${token}">here</a> to verify your email</h1>`,
          };
           transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
            }
          });
          return done(null, newUser, { message: "User created" });
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.use(
    "register-agent",
    new LocalStrategy(
      {
        usernameField: "agentname",
        passReqToCallback: true,
      },
      async (req, agentname, password, done) => {
        try {
          let agent = await Agent.findOne({ agentname: agentname });
          if (agent) {
            return done(null, false, { message: "Agentname already taken" });
          }
          let salt = await bcrypt.genSalt(10);
          password = await bcrypt.hash(password, salt);
          let token = randomstring.generate();
          let newAgent = new Agent({
            agency: req.body.agency,
            fullname: req.body.fullname,
            agentname: req.body.agentname,
            email: req.body.email,
            password: password,
            token: token,
          });
          await newAgent.save();
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.user,
              pass: process.env.pass,
            },
          });
          const mailOptions = {
            from: "noreply@email.com",
            to: newAgent.email,
            subject: "Welcome to our website",
            html: `<h1>Click <a href="${host}/api/agents/verify/${token}">here</a> to verify your email</h1>`,
          };
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
            }
            else return done(null, newAgent, { message: "Agent created" });
          });
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.use(
    "login-user",
    new LocalStrategy(async (username, password, done) => {
      let user = await User.findOne({ username: username });
      if (!user) return done(null, false, { message: "Incorrect username." });
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user, { message: "Logged in successfully" });
    })
  );

  passport.use(
    "login-agent",
    new LocalStrategy(
      {
        usernameField:"agentname"
      },
      async (agentname, password, done) => {
      let agent = await Agent.findOne({ agentname: agentname});
      if (!agent) return done(null, false, { message: "Incorrect username." });
      let isMatch = await bcrypt.compare(password, agent.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, agent, { message: "Logged in successfully" });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      let user = await User.findOne({ _id: id });
      if (user) return done(null, user);
      let agent = await Agent.findOne({ _id: id });
      return done(null, agent);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = passportconfig;
