import MainEntity from '../models/MainEntity.js';
import Activity from '../models/Activity.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalReadmes = await MainEntity.countDocuments({ user: req.user._id });

        // Calculate total generated characters (mock metric)
        const readmes = await MainEntity.find({ user: req.user._id });
        const totalLines = readmes.reduce((acc, curr) => acc + (curr.content ? curr.content.split('\n').length : 0), 0);

        const recentActivity = await Activity.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalReadmes,
            totalLines,
            recentActivity
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
