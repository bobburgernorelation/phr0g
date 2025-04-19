class EnhancedLearningService {
    constructor() {
        this.linkedinService = require('./linkedinIntegrationService');
        this.profileAnalyzer = require('./profileAnalyzerService');
        this.feedbackLearning = require('./feedbackLearningService');
    }

    async enhanceUserProfile(userId, linkedinToken, resumeData) {
        try {
            // Fetch LinkedIn profile
            const linkedinProfile = await this.linkedinService.getProfileData(linkedinToken);

            // Analyze combined profile data
            const enhancedProfile = await this.profileAnalyzer.analyzeProfile(
                linkedinProfile,
                resumeData
            );

            // Update learning model with enhanced data
            await this.updateLearningModel(enhancedProfile);

            return enhancedProfile;
        } catch (error) {
            console.error('Error enhancing user profile:', error);
            throw error;
        }
    }

    async updateLearningModel(enhancedProfile) {
        const trainingData = await this.prepareEnhancedTrainingData(enhancedProfile);
        await this.feedbackLearning.updateMatchingSystem(trainingData);
    }

    async prepareEnhancedTrainingData(profile) {
        return {
            professionalIdentity: {
                verifiedSkills: profile.skills.filter(skill => skill.verified),
                skillEndorsements: this.processSkillEndorsements(profile),
                careerProgression: this.analyzeCareerProgression(profile.experience),
                industryExpertise: this.calculateIndustryExpertise(profile)
            },
            networkStrength: {
                connectionQuality: await this.analyzeConnectionQuality(profile),
                recommendationStrength: this.analyzeRecommendations(profile),
                industryPresence: this.calculateIndustryPresence(profile)
            },
            achievementMetrics: {
                quantifiableImpact: this.extractQuantifiableImpact(profile),
                qualitativeAchievements: this.categorizeAchievements(profile),
                projectSuccess: this.analyzeProjectSuccess(profile)
            }
        };
    }

    processSkillEndorsements(profile) {
        return profile.skills.map(skill => ({
            name: skill.name,
            endorsementCount: skill.endorsements,
            endorserQuality: this.calculateEndorserQuality(skill.endorsers),
            relevanceScore: this.calculateSkillRelevance(skill)
        }));
    }

    analyzeCareerProgression(experience) {
        return {
            trajectory: this.calculateCareerTrajectory(experience),
            growthRate: this.calculateGrowthRate(experience),
            roleEvolution: this.analyzeRoleEvolution(experience),
            industryMovement: this.trackIndustryMovement(experience)
        };
    }

    calculateIndustryExpertise(profile) {
        const industries = new Set();
        let totalMonths = 0;
        const expertiseByIndustry = {};

        profile.experience.forEach(role => {
            const industry = role.industry.toLowerCase();
            industries.add(industry);

            const months = this.calculateMonthsBetweenDates(role.startDate, role.endDate);
            totalMonths += months;

            expertiseByIndustry[industry] = (expertiseByIndustry[industry] || 0) + months;
        });

        return {
            primaryIndustry: this.findPrimaryIndustry(expertiseByIndustry),
            industryBreakdown: this.calculateIndustryPercentages(expertiseByIndustry, totalMonths),
            versatilityScore: industries.size / profile.experience.length
        };
    }
}

module.exports = new EnhancedLearningService(); 