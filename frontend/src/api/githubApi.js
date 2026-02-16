import api from './axios';

// Get user repositories from GitHub
export const getUserRepos = async () => {
    const response = await api.get('/github/repos');
    return response.data;
};

// Get repository details
export const getRepoDetails = async (owner, repo) => {
    const response = await api.get(`/github/repos/${owner}/${repo}`);
    return response.data;
};

// Get repository content (file list or file content)
export const getRepoContent = async (owner, repo, path = '') => {
    const response = await api.get(`/github/content?owner=${owner}&repo=${repo}&path=${path}`);
    return response.data;
};

// Analyze repo for tech stack
export const analyzeRepo = async (owner, repo) => {
    const response = await api.post('/github/analyze', { owner, repo });
    return response.data;
};
