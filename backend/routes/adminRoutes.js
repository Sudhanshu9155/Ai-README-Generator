import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { authenticateAdmin } from '../middleware/adminMiddleware.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import MainEntity from '../models/MainEntity.js';

const router = express.Router();

// ─────────────────────────────────────────────
// POST /api/admin/login
// Public — issue an admin JWT
// ─────────────────────────────────────────────
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        const token = jwt.sign(
            { username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        return res.json({ token });
    }

    res.status(401).json({ message: 'Invalid admin credentials' });
});

// ─────────────────────────────────────────────
// GET /api/admin/stats
// ─────────────────────────────────────────────
router.get('/stats', authenticateAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const proUsers = await User.countDocuments({ isPro: true });
        const totalReadmes = await MainEntity.countDocuments();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const gensToday = await Activity.countDocuments({
            action: 'CREATED_README',
            createdAt: { $gte: today }
        });

        res.json({ totalUsers, proUsers, gensToday, totalReadmes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/admin/users
// ─────────────────────────────────────────────
router.get('/users', authenticateAdmin, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// POST /api/admin/users/:id/toggle-pro
// ─────────────────────────────────────────────
router.post('/users/:id/toggle-pro', authenticateAdmin, async (req, res) => {
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

// ─────────────────────────────────────────────
// DELETE /api/admin/users/:id
// ─────────────────────────────────────────────
router.delete('/users/:id', authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await Activity.deleteMany({ user: req.params.id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User and associated data deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/admin/users/:id/details
// ─────────────────────────────────────────────
router.get('/users/:id/details', authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const readmes = await MainEntity.find({ user: req.params.id }).sort({ createdAt: -1 });
        const recentActivity = await Activity.find({ user: req.params.id })
            .sort({ createdAt: -1 })
            .limit(20);

        // Build tech profile
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
            techProfile: Object.entries(techCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/admin/activities
// ─────────────────────────────────────────────
router.get('/activities', authenticateAdmin, async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate({ path: 'user', select: 'name email', options: { strictPopulate: false } })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();  // plain JS objects, faster + avoids populate errors on null user
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/admin/notifications
// Today's logins and registers
// ─────────────────────────────────────────────
router.get('/notifications', authenticateAdmin, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activities = await Activity.find({
            action: { $in: ['LOGIN', 'REGISTER'] },
            createdAt: { $gte: today }
        })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/admin/suspicious
// Multi-criteria suspicious activity detection
// ─────────────────────────────────────────────
router.get('/suspicious', authenticateAdmin, async (req, res) => {
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

        // 1. High Volume: > 15 README generations in 24h
        const volumeAlerts = await Activity.aggregate([
            { $match: { createdAt: { $gte: oneDayAgo }, action: 'CREATED_README' } },
            { $group: { _id: '$user', count: { $sum: 1 } } },
            { $match: { count: { $gt: 15 } } }
        ]);

        // 2. Burst: > 5 generations in 30 mins
        const burstAlerts = await Activity.aggregate([
            { $match: { createdAt: { $gte: thirtyMinsAgo }, action: 'CREATED_README' } },
            { $group: { _id: '$user', count: { $sum: 1 } } },
            { $match: { count: { $gt: 5 } } }
        ]);

        // 3. Login frequency: > 10 logins in 24h
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
                    count: data.triggers[0].count
                });
            }
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/admin/analytics/tech-stacks
// ─────────────────────────────────────────────
router.get('/analytics/tech-stacks', authenticateAdmin, async (req, res) => {
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

// ─────────────────────────────────────────────
// GET /api/admin/system/status
// ─────────────────────────────────────────────
router.get('/system/status', authenticateAdmin, async (req, res) => {
    try {
        const readyState = mongoose.connection.readyState;
        const dbStatus = readyState === 1 ? 'Healthy' : readyState === 2 ? 'Connecting' : 'Disconnected';

        let collectionsCount = 0;
        try {
            const collections = await mongoose.connection.db.listCollections().toArray();
            collectionsCount = collections.length;
        } catch (_) { /* db might not be fully ready */ }

        const uptimeSeconds = Math.floor(process.uptime());  // always a number
        const memoryMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

        res.json({
            db: dbStatus,
            uptime: uptimeSeconds,
            collections: collectionsCount,
            memory: memoryMB
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// GET /api/admin/debug  ← TEMPORARY diagnostic
// Shows what DB is connected and doc counts
// ─────────────────────────────────────────────
router.get('/debug', authenticateAdmin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const activityCount = await Activity.countDocuments();
        const readmeCount = await MainEntity.countDocuments();
        const db = mongoose.connection;

        res.json({
            dbName: db.name,
            dbHost: db.host,
            readyState: db.readyState,
            env_MONGO_DB_NAME: process.env.MONGO_DB_NAME,
            counts: { users: userCount, activities: activityCount, readmes: readmeCount },
            JWT_SECRET_length: (process.env.JWT_SECRET || '').length,
            ADMIN_USERNAME: process.env.ADMIN_USERNAME || '(not set)',
        });
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

export default router;
