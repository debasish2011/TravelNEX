const User = require("../../models/User");
const Agent = require("../../models/Agent");

const isLoggedOut = async function (req, res, next) {
  try {
    if (req.session.passport) {
      let person = await User.findById(req.session.passport.user);
      if(person){
        return res.redirect("/dashboardUser");
      } 
      let agent = await Agent.findById(req.session.passport.user);
      if(agent){
        return res.redirect("/dashboardAgent");
      }
    }
    return next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = isLoggedOut;