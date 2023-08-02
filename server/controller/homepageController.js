exports.home = async (req, res) => {
  const locals = {
    title: "TravelNEX | Home",
  };
  try {
    res.render("homepage", locals);
  } catch (error) {
    console.log(error);
  }
};
