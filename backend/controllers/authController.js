import User from '../models/User.js';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.js';

export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken({ id: user._id });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                githubId: null,
                githubUsername: null,
                token,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message,
        });
    }
};

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const token = generateToken({ id: user._id });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                githubId: user.githubId || null,
                githubUsername: user.githubUsername || null,
                token,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message,
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isPro: user.isPro,
                avatar: user.avatar,
                githubId: user.githubId || null,
                githubUsername: user.githubUsername || null,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;

        const user = req.user;

        if (name) user.name = name;
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already taken',
                });
            }
            user.email = email;
        }
        if (avatar) user.avatar = avatar;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

export const oauthCallback = (req, res) => {
    const token = generateToken({ id: req.user._id });
    const frontendBaseUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
    // Redirect to frontend with token
    res.redirect(`${frontendBaseUrl}/oauth-callback?token=${token}`);
};
