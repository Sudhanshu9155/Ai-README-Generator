// import express from 'express';
// import passport from 'passport';
// import {
//     register,
//     login,
//     getMe,
//     updateProfile,
//     logout,
//     oauthCallback
// } from '../controllers/authController.js';
// import { protect } from '../middleware/authMiddleware.js';
// import {
//     registerValidation,
//     loginValidation,
//     validate,
// } from '../middleware/validate.js';

// const router = express.Router();

// router.post('/register', registerValidation, validate, register);
// router.post('/login', loginValidation, validate, login);

// // OAuth Routes
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback',
//     passport.authenticate('google', {
//         session: false,
//         failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`
//     }),
//     oauthCallback
// );

// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
// router.get('/github/callback',
//     passport.authenticate('github', {
//         session: false,
//         failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`
//     }),
//     oauthCallback
// );

// router.get('/me', protect, getMe);
// router.put('/update', protect, updateProfile);
// router.post('/logout', protect, logout);

// export default router;

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

/* ===========================
   Normal Auth Routes
=========================== */

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);


/* ===========================
   Google OAuth
=========================== */

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`
    }),
    oauthCallback
);


/* ===========================
   GitHub OAuth  🔥 FIXED
=========================== */

router.get(
    '/github',
    passport.authenticate('github', {
        scope: ['repo', 'user:email']   // ✅ IMPORTANT FIX
    })
);

router.get(
    '/github/callback',
    passport.authenticate('github', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`
    }),
    oauthCallback
);


/* ===========================
   Protected Routes
=========================== */

router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;