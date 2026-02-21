import MainEntity from '../models/MainEntity.js';
import Activity from '../models/Activity.js';

// Helper: format Date to YYYY-MM-DD
const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalReadmes = await MainEntity.countDocuments({ user: req.user._id });

        // Calculate total lines across all READMEs
        const allReadmes = await MainEntity.find({ user: req.user._id });
        const totalLines = allReadmes.reduce((acc, curr) => acc + (curr.content ? curr.content.split('\n').length : 0), 0);

        const recentActivity = await Activity.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        // Build last 7 days analytics (including today)
        const today = new Date();
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            days.push(formatDateKey(d));
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Fetch readmes from last 7 days only to minimize data
        const recentReadmes = await MainEntity.find({
            user: req.user._id,
            createdAt: { $gte: sevenDaysAgo }
        }).select('createdAt content title');

        // Initialize map (include projectList to avoid undefined access)
        const map = {};
        days.forEach((day) => {
            map[day] = { projects: 0, lines: 0, projectList: [] };
        });

        recentReadmes.forEach((r) => {
            const key = formatDateKey(new Date(r.createdAt));
            const lines = r.content ? r.content.split('\n').length : 0;
            if (!map[key]) map[key] = { projects: 0, lines: 0, projectList: [] };
            map[key].projects += 1;
            map[key].lines += lines;
            map[key].projectList.push({ title: r.title || 'Untitled', lines });
        });

        const last7Days = days.map((d) => ({ date: d, projects: map[d].projects, lines: map[d].lines, projectList: map[d].projectList || [] }));

        res.json({
            totalReadmes,
            totalLines,
            recentActivity,
            last7Days
        });
    } catch (error) {
        console.error('Analytics error:', error);
        // In dev it's useful to return the error message for debugging
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
