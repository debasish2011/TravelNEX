const express = require("express");
const {
  isAgentLoggedIn,
  isUserLoggedIn,
  isAgentOrUserLoggedIn,
} = require("../middleware/isLoggedIn");
const controller = require("../controller/appointmentsController");
const Agent = require("../../models/Agent");
const User = require("../../models/User");
const Appointments = require("../../models/Appointments");
const nodemailer = require("nodemailer");

const router = express.Router();
require("dotenv").config({ path: "../../.env" });

// all appointments page
router.get("/allappointments", isUserLoggedIn, async (req, res) => {
  try {
    let appointments = await Appointments.find({
      bookingStatus: "Available",
    });
    return res.status(200).json(appointments);
  } catch (error) {
    console.log(error);
    return res.redirect("/opps");
  }
});

// appointments fetching route
router.get("/fetchallappointments", isAgentOrUserLoggedIn, async (req, res) => {
  try {
    let user = await User.findById(req.session.passport.user);
    if (user) {
      let appointments = await Appointments.find({
        userid: user._id,
      });
      return res.status(200).json(appointments);
    }
    let agent = await Agent.findById(req.session.passport.user);
    let appointments = await Appointments.find({
      agentid: agent._id,
    });
    return res.status(200).json(appointments);
  } catch (error) {
    console.log(error);
    return res.redirect("/opps");
  }
});

// appointments creating page
router.get(
  "/createappointments",
  isAgentLoggedIn,
  controller.createappointments
);

// appointments booking page
router.get("/bookappointments", isUserLoggedIn, controller.bookappointments);

// appointments canceling page
router.get("/cancelappointments/:id", isUserLoggedIn, async (req, res) => {
  try {
    let user = await User.findById(req.session.passport.user);
    let appointments = await Appointments.findById(req.params.id);
    let agent = await Agent.findById(appointments.agentid);
    if (appointments.userid.toString() !== user._id.toString()) {
      return res.redirect("/opps");
    }
    appointments.userid = null;
    appointments.bookingStatus = "Cancelled";
    await appointments.save();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });
    let mailOptions = {
      from: process.env.user,
      to: user.email,
      subject: "Appointment Cancelled",
      text: `Your have cancelled the appointment with ${agent.fullname} on ${new Date(appointments.date).toDateString()} at ${appointments.start_time} in Room ${appointments.location}.`,
    };
    let link = `${process.env.host}/api/appointments/reappoint/${appointments._id}`;
    let mailOptions2 = {
      from: process.env.user,
      to: agent.email,
      subject: "Appointment Cancelled",
      text: `Your appointment with ${user.firstname} ${user.lastname} on ${new Date(appointments.date).toDateString()} at ${appointments.start_time} in Room ${appointments.location} has been cancelled. To reappoint the appointment click on this ${link}.`,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
      }
    });

    transporter.sendMail(mailOptions2, (err, data) => {
      if (err) {
        console.log(err);
      }
    });

    return res.redirect("/success");
  } catch (error) {
    console.log(error);
    return res.redirect("/opps");
  }
});

// appointments reassigning page
router.get("/reappoint/:id", isAgentLoggedIn, async (req, res) => {
  try {
    let agent = await Agent.findById(req.session.passport.user);
    let appointments = await Appointments.findById(req.params.id);
    if (appointments.agentid.toString() !== agent._id.toString()) {
      return res.redirect("/opps");
    }
    appointments.bookingStatus = "Available";
    await appointments.save();

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      }
    });

    let mailOptions = {
      from: process.env.user,
      to: agent.email,
      subject: "Appointment Rescheduled",
      text: `Your have reappointed the appointment on ${new Date(appointments.date).toDateString()} at ${appointments.start_time} in Room ${appointments.location}.`,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
      }
    });
    
    return res.redirect("/success");
  } catch (error) {
    return res.redirect("/opps");
  }
});

// appointments deleting page
router.get("/deleteappointments/:id", isAgentLoggedIn, async (req, res) => {
  try {
    let agent = await Agent.findById(req.session.passport.user);
    let appointments = await Appointments.findById(req.params.id);
    if (appointments.agentid.toString() !== agent._id.toString()) {
      return res.redirect("/opps");
    }
    await Appointments.findByIdAndDelete(req.params.id);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    let mailOptions = {
      from: process.env.user,
      to: agent.email,
      subject: "Appointment Deleted",
      text: `Your have deleted the appointment on ${new Date(appointments.date).toDateString()} at ${appointments.start_time} in Room ${appointments.location}.`,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
      }
    });

    if (appointments.userid) {
      let user = await User.findById(appointments.userid);
      let mailOptions2 = {
        from: process.env.user,
        to: user.email,
        subject: "Appointment Deleted",
        text: `Your appointment on ${new Date(appointments.date).toDateString()} at ${appointments.start_time} with ${agent.fullname} in Room ${appointments.location} has been deleted by the agent.`,
      };

      transporter.sendMail(mailOptions2, (err, data) => {
        if (err) {
          console.log(err);
        }
      });
    }

    return res.redirect("/success");
  } catch (error) {
    console.log(error);
    return res.redirect("/opps");
  }
});

// appointments creating page
router.post("/createappointments", isAgentLoggedIn, async (req, res) => {
  try {
    let { starttime, endtime, date, location } = req.body;
    let agentid = req.session.passport.user;
    let agent = await Agent.findById(agentid);
    let appointments = await Appointments.findOne({
      agentname: agent.agentname,
      date: date,
      start_time: starttime,
      end_time: endtime,
      location: location,
    });
    if (appointments) {
      return res.redirect("/opps");
    }
  } catch (error) {
    console.log(error);
  }
  let { starttime, endtime, date, location } = req.body;
  let agentid = req.session.passport.user;
  let agent = await Agent.findById(agentid);
  let newAppointments = new Appointments({
    agentid: agentid,
    agentname: agent.agentname,
    date: date,
    start_time: starttime,
    end_time: endtime,
    location: location,
  });
  await newAppointments.save();

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  let mailOptions = {
    from: process.env.user,
    to: agent.email,
    subject: "Appointment Created",
    text: `Your have created an appointment on ${new Date(date).toDateString()} at ${starttime} in Room ${location}.`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    }
  });

  return res.redirect("/success");
});

// appointments booking page
router.get("/bookappointments/:id", isUserLoggedIn, async (req, res) => {
  let userid = req.session.passport.user;
  let appointments = await Appointments.findById(req.params.id);
  let user = await User.findById(userid);
  let agent = await Agent.findById(appointments.agentid);
  appointments.userid = userid;
  appointments.bookingStatus = "Booked";
  await appointments.save();

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  let mailOptions = {
    from: process.env.user,
    to: user.email,
    subject: "Appointment Booked",
    text: `Your have booked an appointment with ${agent.fullname} on ${new Date(appointments.date).toDateString()} at ${appointments.start_time} in Room ${appointments.location}.`,
  };

  let mailOptions2 = {
    from: process.env.user,
    to: agent.email,
    subject: "Appointment Booked",
    text: `Your appointment with ${user.firstname} ${user.lastname} on ${new Date(appointments.date).toDateString()} at ${appointments.start_time} in Room ${appointments.location} has been booked.`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    }
  });

  transporter.sendMail(mailOptions2, (err, data) => {
    if (err) {
      console.log(err);
    }
  });

  return res.redirect("/success");
});

module.exports = router;
