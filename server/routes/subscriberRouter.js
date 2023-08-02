const express = require("express");
const Subscriber = require("../../models/Subscriber");
const router = express.Router();


router.post("/", async (req, res) => {
    try {
        let { email } = req.body;
        let subscriber = await Subscriber.findOne({ email: email });
        if (subscriber) {
            return res.redirect("/opps");
        }
        subscriber = new Subscriber({ email : email });
        await subscriber.save();
        res.status(200).redirect("/success");
    } catch (error) {
        res.status(404).redirect("/opps");
    }
});

module.exports = router;