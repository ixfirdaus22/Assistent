const express = require('express');
const router = express.Router();

router.post('/start', (req, res) => {
    //TODO: Implement start new interview
    res.json({ message: 'Start new interview endpoint' });
});

router.get('/:id', (req, res) => {
    //TODO: Implement get interview by ID
    res.json({ message: 'Get interview with ID: ${req.params.id' });
});

router.post('/:id/answer', (req, res) => {
    //TODO: Implement submit answer for interview question
    res.json({ message: 'Submit answer for interview: ${req.params.id}' });
});

module.exports = router;