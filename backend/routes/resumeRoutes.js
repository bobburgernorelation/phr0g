const express = require('express');
const resumeParser = require('../services/resumeParser');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/upload', authenticate, async (req, res) => {
    try {
        if (!req.files || !req.files.resume) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }

        const resumeBuffer = req.files.resume.data;
        const parsedResume = await resumeParser.parsePDF(resumeBuffer);
        res.json({ resume: parsedResume });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 