import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB();

// Models (Shared with main project but redefined here for separation)
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    isPro: { type: Boolean, default: false },
    freeGenerationsUsed: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const activitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    details: String,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const mainEntitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    techStack: [String],
    isPublic: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Activity = mongoose.model('Activity', activitySchema);
const MainEntity = mongoose.model('MainEntity', mainEntitySchema);

// Admin Auth Middleware
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') throw new Error();
        next();
    } catch (error) {
        res.status(403).json({ message: 'Forbidden' });
    }
};

// Routes
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
});

// Get all users
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle Pro status
app.post('/api/admin/users/:id/toggle-pro', authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isPro = !user.isPro;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user
app.delete('/api/admin/users/:id', authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete associated activities first
        await Activity.deleteMany({ user: req.params.id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User and associated data deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all activities
app.get('/api/admin/activities', authenticateAdmin, async (req, res) => {
    try {
        const activities = await Activity.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(100);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Detect Suspicious Activity (Multi-Criteria Analysis)
app.get('/api/admin/suspicious', authenticateAdmin, async (req, res) => {
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

        // 1. High Volume Filter (>15 gens / 24h)
        const volumeAlerts = await Activity.aggregate([
            { $match: { createdAt: { $gte: oneDayAgo }, action: 'CREATED_README' } },
            { $group: { _id: '$user', count: { $sum: 1 } } },
            { $match: { count: { $gt: 15 } } }
        ]);

        // 2. Generation Burst Filter (>5 gens / 30 mins)
        const burstAlerts = await Activity.aggregate([
            { $match: { createdAt: { $gte: thirtyMinsAgo }, action: 'CREATED_README' } },
            { $group: { _id: '$user', count: { $sum: 1 } } },
            { $match: { count: { $gt: 5 } } }
        ]);

        // 3. Login Frequency Filter (>10 logins / 24h)
        const loginAlerts = await Activity.aggregate([
            { $match: { createdAt: { $gte: oneDayAgo }, action: 'LOGIN' } },
            { $group: { _id: '$user', count: { $sum: 1 } } },
            { $match: { count: { $gt: 10 } } }
        ]);

        const suspiciousMap = new Map();

        const addAlert = (userId, reason, severity, count) => {
            if (!userId) return;
            const key = userId.toString();
            if (!suspiciousMap.has(key)) {
                suspiciousMap.set(key, { userId, triggers: [] });
            }
            suspiciousMap.get(key).triggers.push({ reason, severity, count });
        };

        volumeAlerts.forEach(a => addAlert(a._id, 'High Volume Generation', 'medium', a.count));
        burstAlerts.forEach(a => addAlert(a._id, 'Automated Bot Pattern (Burst)', 'high', a.count));
        loginAlerts.forEach(a => addAlert(a._id, 'Unusual Login Frequency', 'low', a.count));

        const result = [];
        for (let [id, data] of suspiciousMap) {
            const user = await User.findById(id);
            if (user) {
                result.push({
                    user,
                    triggers: data.triggers,
                    overallSeverity: data.triggers.some(t => t.severity === 'high') ? 'critical' : 'warning',
                    count: data.triggers[0].count // For backward compat with frontend simplicity
                });
            }
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Stats
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const proUsers = await User.countDocuments({ isPro: true });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const gensToday = await Activity.countDocuments({ action: 'CREATED_README', createdAt: { $gte: today } });

        res.json({ totalUsers, proUsers, gensToday });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Notifications (Today's logins and registers)
app.get('/api/admin/notifications', authenticateAdmin, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activities = await Activity.find({
            action: { $in: ['LOGIN', 'REGISTER'] },
            createdAt: { $gte: today }
        }).populate('user', 'name email').sort({ createdAt: -1 });

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Deep User Details
app.get('/api/admin/users/:id/details', authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const readmes = await MainEntity.find({ user: req.params.id }).sort({ createdAt: -1 });
        const recentActivity = await Activity.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(20);

        // Analyze tech profile
        const techCounts = {};
        readmes.forEach(r => {
            r.techStack.forEach(tech => {
                techCounts[tech] = (techCounts[tech] || 0) + 1;
            });
        });

        res.json({
            user,
            readmes,
            activity: recentActivity,
            techProfile: Object.entries(techCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Tech Stack Analytics
app.get('/api/admin/analytics/tech-stacks', authenticateAdmin, async (req, res) => {
    try {
        const allEntities = await MainEntity.find({}, 'techStack');
        const counts = {};
        allEntities.forEach(e => {
            e.techStack.forEach(tech => {
                const normalized = tech.trim();
                counts[normalized] = (counts[normalized] || 0) + 1;
            });
        });

        const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, value]) => ({ name, value }));

        res.json(sorted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// System Status
app.get('/api/admin/system/status', authenticateAdmin, async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'Healthy' : 'Disconnected';
        const collections = await mongoose.connection.db.listCollections().toArray();
        const stats = {
            db: dbStatus,
            uptime: Math.floor(process.uptime()),
            collections: collections.length,
            memory: process.memoryUsage().heapUsed / 1024 / 1024
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Admin Backend running on port ${PORT}`));
