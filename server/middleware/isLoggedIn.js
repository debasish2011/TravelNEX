const Agent = require("../../models/Agent");
const User = require("../../models/User");

exports.isUserLoggedIn = async function (req, res, next) {
  try {
    if (!req.session.passport) {
      return res.redirect("/api/users/login");
    }
    let userid = req.session.passport.user;
    let user = await User.findById(userid);
    if (!user) {
      return res.redirect("/api/users/login");
    }
    return next();
  } catch (err) {
    console.log(err);
  }
};

exports.isAgentLoggedIn = async function (req, res, next) {
  try {
    if (!req.session.passport) {
      return res.redirect("/api/agents/login");
    }
    let agentid = req.session.passport.user;
    let agent = await Agent.findById(agentid);
    if (!agent) {
      return res.redirect("/api/agents/login");
    }
    return next();
  } catch (err) {
    console.log(err);
  }
};

exports.isAgentOrUserLoggedIn = async function (req, res, next) {
  try {
    if (!req.session.passport) {
      return res.redirect("/api/users/login");
    }
    return next();
  } catch (err) {
    console.log(err);
  }
}