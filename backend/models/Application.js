const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    status: {
        type: String,
        enum: ['applied', 'interviewing', 'offer', 'rejected'],
        default: 'applied',
    },
    appliedDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', ApplicationSchema); 