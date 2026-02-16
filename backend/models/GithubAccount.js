import mongoose from 'mongoose';

const githubAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    githubId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    profileUrl: {
        type: String
    },
    avatarUrl: {
        type: String
    }
}, {
    timestamps: true
});

const GithubAccount = mongoose.model('GithubAccount', githubAccountSchema);
export default GithubAccount;
