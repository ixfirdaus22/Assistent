const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['behavioral', 'technical', 'situational'],
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    expectedAnswer: {
        type: String,
    },
});

module.exports = mongoose.model('Question', QuestionSchema);