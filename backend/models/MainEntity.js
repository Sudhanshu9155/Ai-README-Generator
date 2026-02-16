import mongoose from 'mongoose';

const mainEntitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    techStack: {
        type: [String],
        default: []
    },
    features: {
        type: [String],
        default: []
    },
    installation: {
        type: String
    },
    usage: {
        type: String
    },
    repoUrl: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const MainEntity = mongoose.model('MainEntity', mainEntitySchema);
export default MainEntity;
