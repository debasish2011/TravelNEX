//create server
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo");
const expressLayouts = require("express-ejs-layouts");
const Agent = require("./models/Agent");
const User = require("./models/User");
const nodeMailer = require("nodemailer");
const randomstring = require("randomstring");
const port = process.env.PORT || 5000;
const connectMongo = require("./mongoConnect");
const passportconfig = require("./server/middleware/passport-config");

dotenv.config({ path: "./.env" });
// MongoDB connection string
const mongoLink = process.env.mongoLink;

const host = process.env.host;
passportconfig(passport);

const app = express();
app.use(cors());
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layouts/home");
app.use(express.static("public"));
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: false,
  })
);

// Passport middleware
app.use(
  session({
    secret: process.env.jwt,
    store: MongoStore.create({ mongoUrl: mongoLink }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

connectMongo();

// Routes
app.use("/", require("./server/routes/homepageRouter"));
app.use("/", require("./server/routes/dashboardRouter"));
app.use("/api/subscribe", require("./server/routes/subscriberRouter"));
app.use("/api/quaries", require("./server/routes/quariesRouter"));
app.use("/api/appointments", require("./server/routes/appointmentsRouter"));
app.use("/api/users", require("./server/routes/userRouter"));
app.use("/api/agents", require("./server/routes/agentRouter"));

// opps page
app.get("/opps", (req, res) => {
  const locals = {
    title: "Opps!",
    layout: "./layouts/blank",
  };
  try {
    res.render("opps", locals);
  } catch (error) {
    console.log(error);
  }
});

// success page
app.get("/success", (req, res) => {
  const locals = {
    title: "Success!",
    layout: "./layouts/blank",
  };
  try {
    res.render("success", locals);
  } catch (error) {
    console.log(error);
  }
});

// Resend email
app.get("/resend", async (req, res) => {
  let user = await User.findById(req.session.passport.user);
  let agent = await Agent.findById(req.session.passport.user);
  if (user) {
    let token = randomstring.generate();
    user.token = token;
    await user.save();
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });
    let mailOptions = {
      from: "noreply@email.com",
      to: user.email,
      subject: "Verify Email",
      html: `<h1>Click <a href="${host}/api/users/verify/${token}">here</a> to verify your email</h1>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.redirect("/opps");
      } else {
        res.redirect("/");
      }
    });
  } else if (agent) {
    let token = randomstring.generate();
    agent.token = token;
    await agent.save();
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });
    let mailOptions = {
      from: "noreply@email.com",
      to: agent.email,
      subject: "Verify Email",
      html: `<h1>Click <a href="${host}/api/agents/verify/${token}">here</a> to verify your email</h1>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.redirect("/opps");
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/opps");
  }
});

// Logout
app.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${host}`);
});
