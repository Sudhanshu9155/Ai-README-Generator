import express from 'express';
import passport from 'passport';
import {
    register,
    login,
    getMe,
    updateProfile,
    logout,
    oauthCallback
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
    registerValidation,
    loginValidation,
    validate,
} from '../middleware/validate.js';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    oauthCallback
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    oauthCallback
);

router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;
