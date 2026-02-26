import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false   // optional — some system events may not have a user
    },
    action: {
        type: String,
        required: true,
        enum: [
            'CREATED_README',
            'UPDATED_README',
            'DELETED_README',
            'LOGIN',
            'REGISTER',
            'GITHUB_SYNC',
            'PRO_GRANTED',
            'PRO_REVOKED',
            'ADMIN_ACTION'
        ]
    },
    details: {
        type: String
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainEntity'
    }
}, {
    timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
