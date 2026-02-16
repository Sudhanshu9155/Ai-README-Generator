import axios from 'axios';

export const fetchRepoDetails = async (accessToken, owner, repo) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('GitHub API Error:', error);
        throw new Error('Failed to fetch repository details');
    }
};

export const fetchRepoContents = async (accessToken, owner, repo, path = '') => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('GitHub API Error:', error);
        throw new Error('Failed to fetch repository contents');
    }
};
