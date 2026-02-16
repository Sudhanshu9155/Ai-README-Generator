import api from './axios';

// Get dashboard statistics
export const getDashboardStats = async () => {
    const response = await api.get('/analytics');
    return response.data;
};

// Get user activity history
export const getUserActivity = async () => {
    const response = await api.get('/activity');
    return response.data;
};
