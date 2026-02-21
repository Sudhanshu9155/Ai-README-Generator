import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false,
            minlength: 6,
            select: false,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
            select: false,
        },
        githubId: {
            type: String,
            unique: true,
            sparse: true,
            select: false,
        },
        githubAccessToken: {
            type: String,
            select: false, // Don't return by default
        },
        githubUsername: {
            type: String,
            sparse: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        freeGenerationsUsed: {
            type: Number,
            default: 0,
        },
        isPro: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);



const User = mongoose.model('User', userSchema);
export default User;
