const express = require('express');
const router = express.Router();
const LinkedInIntegrationService = require('../services/linkedinIntegrationService');
const EnhancedLearningService = require('../services/enhancedLearningService');
const authenticate = require('../middleware/authMiddleware');

router.get('/auth', (req, res) => {
    const authUrl = LinkedInIntegrationService.getAuthorizationUrl();
    res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const accessToken = await LinkedInIntegrationService.handleCallback(code);

        // Store token securely
        await UserProfile.findOneAndUpdate(
            { userId: req.user.uid },
            { linkedinToken: accessToken }
        );

        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/enhance-profile', authenticate, async (req, res) => {
    try {
        const userProfile = await UserProfile.findOne({ userId: req.user.uid });
        const { resumeData } = req.body;

        const enhancedProfile = await EnhancedLearningService.enhanceUserProfile(
            req.user.uid,
            userProfile.linkedinToken,
            resumeData
        );

        res.json({ success: true, profile: enhancedProfile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 