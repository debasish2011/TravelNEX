exports.createappointments = async (req, res) => {
  const locals = {
    title: "Create Appointments",
    layout: "./layouts/agenthome",
    agent : req.user,
  };
  try {
    res.render("createappointments", locals);
  } catch (err) {
    console.log(err);
  }
};

exports.bookappointments = async (req, res) => {
  const locals = {
    title: "Book Appointments",
    layout: "./layouts/userhome",
    user : req.user,
  };
  try {
    res.render("bookappointments", locals);
  } catch (err) {
    console.log(err);
  }
};
