import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATED_README', 'UPDATED_README', 'DELETED_README', 'LOGIN', 'REGISTER', 'GITHUB_SYNC']
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
