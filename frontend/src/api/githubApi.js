
import api from './axios';

// Get list of repositories for the authenticated user
export const listRepos = async () => {
    try {
        const response = await api.get('/github/repos');
        return response.data;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
};

// Analyze a selected repository
export const analyzeRepo = async (repoUrl, repoName) => {
    try {
        const response = await api.post('/github/analyze', { repoUrl, repoName });
        return response.data;
    } catch (error) {
        console.error('Error analyzing repository:', error);
        throw error;
    }
};

// Push README by providing repoName (owner/repo) and content
export const pushReadme = async (mainEntityId) => {
    if (!mainEntityId) {
        throw new Error('MainEntity ID is required');
    }

    try {
        const response = await api.post('/github/push', {
            mainEntityId
        });

        return response.data;
    } catch (error) {
        console.error(
            'Error pushing README:',
            error.response?.data || error.message
        );
        throw error;
    }
};