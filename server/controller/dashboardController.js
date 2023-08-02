exports.dashboardUser = async (req, res) => {
  let user = req.user;
  const locals = {
    title: `${req.user.username} | Dashboard`,
    layout: "./layouts/userhome",
    user: user,
  };
  try {
    res.render("dashboardUser", locals);
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardAgent = async (req, res) => {
  const locals = {
    title: `${req.user.agentname} | Dashboard`,
    layout: "./layouts/agenthome",
    agent: req.user,
  };
  try {
    res.render("dashboardagent", locals);
  } catch (error) {
    console.log(error);
  }
};
