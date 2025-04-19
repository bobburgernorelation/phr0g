const LinkedIn = require('node-linkedin')(
    process.env.LINKEDIN_CLIENT_ID,
    process.env.LINKEDIN_CLIENT_SECRET,
    process.env.LINKEDIN_CALLBACK_URL
);
const axios = require('axios');

class LinkedInIntegrationService {
    constructor() {
        this.scope = [
            'r_liteprofile',
            'r_emailaddress',
            'r_fullprofile',
            'w_member_social'
        ];
    }

    async getAuthorizationUrl() {
        return LinkedIn.auth.authorize(this.scope);
    }

    async handleCallback(code) {
        try {
            const accessToken = await LinkedIn.auth.getAccessToken(code);
            return accessToken;
        } catch (error) {
            console.error('LinkedIn auth error:', error);
            throw error;
        }
    }

    async getProfileData(accessToken) {
        const linkedin = LinkedIn.init(accessToken);

        try {
            const [basicProfile, fullProfile, skills] = await Promise.all([
                this.getBasicProfile(linkedin),
                this.getFullProfile(linkedin),
                this.getSkills(linkedin)
            ]);

            return this.normalizeProfileData(basicProfile, fullProfile, skills);
        } catch (error) {
            console.error('Error fetching LinkedIn profile:', error);
            throw error;
        }
    }

    async getBasicProfile(linkedin) {
        return new Promise((resolve, reject) => {
            linkedin.people.me([
                'id', 'first-name', 'last-name', 'headline',
                'location', 'industry', 'summary', 'picture-url'
            ], (err, profile) => {
                if (err) reject(err);
                else resolve(profile);
            });
        });
    }

    async getFullProfile(linkedin) {
        return new Promise((resolve, reject) => {
            linkedin.people.me([
                'positions', 'educations', 'volunteer',
                'certifications', 'courses', 'languages',
                'recommendations-received'
            ], (err, profile) => {
                if (err) reject(err);
                else resolve(profile);
            });
        });
    }

    async getSkills(linkedin) {
        return new Promise((resolve, reject) => {
            linkedin.people.skills((err, skills) => {
                if (err) reject(err);
                else resolve(skills.values);
            });
        });
    }

    normalizeProfileData(basicProfile, fullProfile, skills) {
        return {
            basics: {
                firstName: basicProfile.firstName,
                lastName: basicProfile.lastName,
                headline: basicProfile.headline,
                location: basicProfile.location,
                industry: basicProfile.industry,
                summary: basicProfile.summary,
                pictureUrl: basicProfile.pictureUrl
            },
            experience: this.normalizeExperience(fullProfile.positions.values),
            education: this.normalizeEducation(fullProfile.educations.values),
            skills: this.normalizeSkills(skills),
            certifications: fullProfile.certifications?.values || [],
            recommendations: fullProfile.recommendationsReceived?.values || [],
            languages: fullProfile.languages?.values || []
        };
    }

    normalizeExperience(positions) {
        return positions.map(position => ({
            title: position.title,
            company: position.company.name,
            industry: position.company.industry,
            startDate: `${position.startDate.month}/${position.startDate.year}`,
            endDate: position.isCurrent ? 'Present' :
                `${position.endDate.month}/${position.endDate.year}`,
            description: position.summary,
            skills: this.extractSkillsFromDescription(position.summary)
        }));
    }

    extractSkillsFromDescription(description) {
        // Use NLP to extract skills from job descriptions
        return this.nlpService.extractSkills(description);
    }
}

module.exports = new LinkedInIntegrationService(); 
