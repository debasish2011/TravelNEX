const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    agency: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
    },
    agentname: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    token: {
        type: String,
        default: "",
    },
    agent: {
        type: Boolean,
        default: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    subscriber: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);



