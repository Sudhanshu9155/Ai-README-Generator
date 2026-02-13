// Fix for "SELF_SIGNED_CERT_IN_CHAIN" errors (e.g. from corporate proxies or antivirus)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import "dotenv/config"

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

console.log("MONGO URI:", process.env.MONGO_URI);


const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

import passport from 'passport';
import './config/passport.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'AI README Generator API - Auth Only',
    });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
