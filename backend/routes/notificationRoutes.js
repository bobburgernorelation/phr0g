const express = require('express');
const notificationService = require('../services/notificationService');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/notify', authenticate, async (req, res) => {
    try {
        const { userEmail, jobTitle, status } = req.body;
        await notificationService.notifyApplicationStatus(userEmail, jobTitle, status);
        res.json({ message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 