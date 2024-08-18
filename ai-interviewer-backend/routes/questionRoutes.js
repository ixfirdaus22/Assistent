const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');

//add a new question
router.post('/', auth, async (req, res) => {
    try {
        const { text, type, difficulty, category, expectedAnswer } = req.body;
        const newQuestion = new Question({
            text,
            type,
            difficulty,
            category,
            expectedAnswer
        });
        
        const question = await newQuestion.save();
        res.json(question);
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//get all question
router.get('/', auth, async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//get questions by category and difficulty
router.get('/:category/:difficulty', auth, async (req, res) => {
    try {
        const questions = await Question.find({
            category: req.params.category,
            difficulty: req.params.difficulty
        });
        res.json(questions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;