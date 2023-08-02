exports.login = async (req, res) => {
  const locals = {
    title: "TravelNEX | Login Agent",
  };
  try {
    res.render("loginAgent", locals);
  } catch (error) {
    console.log(error);
  }
};

exports.register = async (req, res) => {
  const locals = {
    title: "TravelNEX | Register Agent",
  };
  try {
    res.render("registerAgent", locals);
  } catch (error) {
    console.log(error);
  }
};

exports.forgotusername = async (req, res) => {
  const locals = {
    title: "Travel Agency | Forgot Username",
  };
  try {
    res.render("forgotUsername", locals);
  } catch (error) {
    console.log(error);
  }
};

exports.forgotpassword = async (req, res) => {
  const locals = {
    title: "TravelNEX | Forgot Password",
  };
  try {
    res.render("forgotPassword", locals);
  } catch (error) {
    console.log(error);
  }
};

exports.resetpassword = async (req, res) => {
  const locals = {
    title: "TravelNEX | Reset Password",
  };
  try {
    res.render("resetPassword", locals);
  } catch (error) {
    console.log(error);
  }
};


