const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { generateQuestion, analyseResponse } = require('../services/openaiService');

//create a new interview session
router.post('/', auth, async (req, res) => {
    try {
        const { jobRole, industry } = req.body;
        const newSession = new InterviewSession({
            user: req.user.id,
            jobRole,
            industry
        });

        const session = await newSession.save();
        res.json(session);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//Get all interview sessions for a user
router.get('/', auth, async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ user: req.user.id }).sort({ startTime: -1});
        res.json(sessions);
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//Get a specific Interview session
router.get('/:id', auth, async (req, res) => {
    try {
        const session = await InterviewSession.findById(req.params.id);
        if(!session) {
            return res.status(404).json({ msg: 'Interview session not found' });
        }

        //check user
        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(session);
    }catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Interview session not found' });
        }
        res.status(500).send('Servor error');
    }
});

//Update an interview session
router.put('/:id', auth, async (req, res) => {
    try {
        let session = await InterviewSession.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ msg: 'Interview session not found' });
        }

        //Check user
        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorised' });
        }

        //update fields
        const { endTime, overallScore, feedback } = req.body;
        if  (endTime) session.endTime = endTime;
        if(overallScore) session.overallScore = overallScore;
        if(feedback) session.feedback = feedback;

        await session.save();
        res.json(session);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//Delete an interview session
router.delete('/:id', auth, async (req, res) => {
    try {
        const session = await InterviewSession.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ msg: 'Interview session not found' });
        }

        //check user
        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorised' });
        }

        await session.remove();
        res.json({ msg: 'Interview session removed' });
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Interview session not found' });
        }
        res.status(500).send('Server error');
    }
});

//start a new interview question
router.post('/:id/questions', auth, async (req, res) => {
    try {
        const session = await InterviewSession.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ msg: 'Interview session not found' });
        }

        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'user not authorised' });
        }

        const question = await generateQuestion(session.jobRole, session.industry, 'medium');

        const newQuestion = new Question({
            text: question,
            type: 'ai-generated',
            difficulty: 'medium',
            category: session.jobRole
        });

        await newQuestion.save();

        session.questions.push(newQuestion._id);
        await session.save();

        res.json(newQuestion);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.post('/:id/answer', auth, async (req, res) => {
    try {
        const { questionId, answerText } = req.body;
        const session = await InterviewSession.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ msg: 'Interview session not found' });
        }

        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not auhorized' });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ msg: 'Question not found' });
        }

        const analysis = await analyseResponse(question.text, answerText, session.jobRole);

        const newAnswer = new Answer({
            question: questionId,
            interviewSession: session._id,
            text: answerText,
            score: analysis.score,
            feedback: analysis.feedback
        });

        await newAnswer.save();

        res.json(newAnswer);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;