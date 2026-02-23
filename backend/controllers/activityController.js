import Activity from '../models/Activity.js';

export const getUserActivity = async (req, res) => {
    try {
        const activity = await Activity.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50); 

        res.json(activity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
