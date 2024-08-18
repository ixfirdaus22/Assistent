const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
    },
    jobRole: {
        type: String,
        required: true,
    },
    industry: {
        type: String,
        required: true,
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    }],
    overallScore: {
        type: Number,
    },
    feedback: {
        type: String,
    },
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);