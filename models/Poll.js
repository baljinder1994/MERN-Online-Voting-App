const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: String,
    votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [optionSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Poll', pollSchema);
