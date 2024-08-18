const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.Objected,
        ref: 'Question',
        required: true,
    },
    interviewSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewSession',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
    },
    feedback: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Answer', AnswerSchema);