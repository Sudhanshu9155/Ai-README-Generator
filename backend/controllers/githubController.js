import { fetchRepoDetails, fetchRepoContents } from '../services/githubService.js';
import GithubAccount from '../models/GithubAccount.js';

// List user repositories
export const getUserRepos = async (req, res) => {
    try {
        const githubAccount = await GithubAccount.findOne({ user: req.user._id });
        if (!githubAccount) {
            return res.status(404).json({ message: 'GitHub account not linked' });
        }
        const response = await fetch(`https://api.github.com/user/repos?per_page=100&sort=updated`, {
            headers: {
                Authorization: `token ${githubAccount.accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch repos from GitHub');
        }

        const repos = await response.json();
        res.json(repos);

    } catch (error) {
        console.error('GitHub API Error:', error);
        res.status(500).json({ message: 'Failed to fetch repositories' });
    }
};

// Get repo details
export const getRepoDetails = async (req, res) => {
    try {
        const githubAccount = await GithubAccount.findOne({ user: req.user._id });
        if (!githubAccount) {
            return res.status(404).json({ message: 'GitHub account not linked' });
        }

        const { owner, repo } = req.params;
        const details = await fetchRepoDetails(githubAccount.accessToken, owner, repo);
        res.json(details);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch repo details' });
    }
};

// Get file content
export const getRepoContent = async (req, res) => {
    try {
        const githubAccount = await GithubAccount.findOne({ user: req.user._id });
        if (!githubAccount) {
            return res.status(404).json({ message: 'GitHub account not linked' });
        }

        const { owner, repo, path } = req.query; // path is query param
        if (!path) return res.status(400).json({ message: 'Path is required' });

        const content = await fetchRepoContents(githubAccount.accessToken, owner, repo, path);
        res.json(content);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch content' });
    }
};

// Analyze repository content
export const analyzeRepo = async (req, res) => {
    try {
        const { owner, repo } = req.body;

        if (!owner || !repo) {
            return res.status(400).json({ message: 'Repository owner and name are required' });
        }

        // TODO: Implement actual analysis logic here (e.g., fetch content, send to AI)

        res.status(200).json({
            message: `Analysis started for ${owner}/${repo}`,
            // Placeholder data
            analysis: {
                summary: "Repository analysis pending implementation.",
                technologies: ["JavaScript", "Node.js"],
                complexity: "Medium"
            }
        });

    } catch (error) {
        console.error('Error analyzing repo:', error);
        res.status(500).json({ message: 'Analysis failed' });
    }
};
