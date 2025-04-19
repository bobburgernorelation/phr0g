const express = require('express');
const Application = require('../models/Application');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/track', authenticate, async (req, res) => {
    try {
        const { jobId, jobTitle, company } = req.body;
        const application = new Application({
            userId: req.user.uid,
            jobId,
            jobTitle,
            company,
        });
        await application.save();
        res.json({ application });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/status', authenticate, async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user.uid });
        res.json({ applications });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 