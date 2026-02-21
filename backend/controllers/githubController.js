
import axios from 'axios';
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import MainEntity from '../models/MainEntity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get user token securely
const getGitHubToken = async (userId) => {
    const user = await User.findById(userId).select('+githubAccessToken');
    if (!user || !user.githubAccessToken) {
        throw new Error('User not connected to GitHub');
    }
    return user.githubAccessToken;
};

// List user repositories
export const listRepos = async (req, res) => {
    try {
        const token = await getGitHubToken(req.user._id);

        const response = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        const repos = response.data.map(repo => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            clone_url: repo.clone_url,
            language: repo.language,
            updated_at: repo.updated_at,
        }));

        res.json(repos);
    } catch (error) {
        console.error('Error listing repos:', error.message);
        res.status(500).json({ message: 'Failed to fetch repositories', error: error.message });
    }
};

// Analyze a selected repository using simple-git
export const analyzeRepo = async (req, res) => {
    const { repoUrl, repoName } = req.body;
    let tempDir = null;

    try {
        if (!repoUrl) {
            return res.status(400).json({ message: 'Repository URL is required' });
        }

        const token = await getGitHubToken(req.user._id);

        // Construct authenticated URL for cloning
        // Format: https://<token>@github.com/username/repo.git
        const authRepoUrl = repoUrl.replace('https://', `https://${token}@`);

        // Create a temporary directory for cloning
        const timestamp = Date.now();
        const safeRepoName = (repoName || 'repo').replace(/[^a-zA-Z0-9]/g, '_');
        tempDir = path.join(__dirname, '..', 'temp', `${safeRepoName}_${timestamp}`);

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        console.log(`Cloning ${repoUrl} to ${tempDir}...`);

        // Use simple-git to clone
        const git = simpleGit();
        await git.clone(authRepoUrl, tempDir);

        console.log('Clone successful. Analyzing files...');

        // Analysis Logic (simplified for now)
        // 1. Check for package.json (Node.js)
        // 2. Check for requirements.txt (Python)
        // 3. Read README.md if exists

        let techStack = [];
        let description = '';
        let projectTitle = repoName || '';

        // Check package.json
        const packageJsonPath = path.join(tempDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            techStack.push('Node.js');
            if (pkg.dependencies) {
                techStack.push(...Object.keys(pkg.dependencies));
            }
            if (pkg.description) {
                description = pkg.description;
            }
            if (pkg.name) {
                projectTitle = pkg.name;
            }
        }

        // Check requirements.txt
        const requirementsPath = path.join(tempDir, 'requirements.txt');
        if (fs.existsSync(requirementsPath)) {
            techStack.push('Python');
            // rudimentary parsing
            const reqs = fs.readFileSync(requirementsPath, 'utf8').split('\n');
            reqs.forEach(r => {
                const lib = r.split('=')[0].trim();
                if (lib) techStack.push(lib);
            });
        }

        // Clean up: Delete the temp directory
        // In production, use a more robust cleanup or separate worker
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (cleanupErr) {
            console.error('Error cleaning up temp dir:', cleanupErr);
        }

        res.json({
            title: projectTitle,
            description,
            techStack: [...new Set(techStack)], // unique items
            analyzed: true
        });

    } catch (error) {
        console.error('Error analyzing repo:', error);

        // Try cleanup if error occurred
        if (tempDir && fs.existsSync(tempDir)) {
            try {
                fs.rmSync(tempDir, { recursive: true, force: true });
            } catch (cleanupErr) {
                console.error('Error cleaning up temp dir after failure:', cleanupErr);
            }
        }

        res.status(500).json({ message: 'Failed to analyze repository', error: error.message });
    }
};

//for push github readme
export const pushToRepo = async (req, res) => {
    const { mainEntityId } = req.body;

    if (!mainEntityId) {
        return res.status(400).json({ message: "MainEntity ID required" });
    }

    try {
        const token = await getGitHubToken(req.user._id);

        if (!token) {
            return res.status(401).json({ message: "GitHub token not found" });
        }

        // 1️⃣ Get MainEntity
        const entity = await MainEntity.findById(mainEntityId);

        if (!entity || !entity.repoUrl) {
            return res.status(404).json({ message: "Repository URL not found in MainEntity" });
        }

        console.log("Repo URL from DB:", entity.repoUrl);

        // 2️⃣ Convert repoUrl → owner/repo
        let repoName = entity.repoUrl
            .replace('https://github.com/', '')
            .replace('.git', '')
            .trim();

        console.log("Converted repoName:", repoName);
        console.log("Token exists:", !!token);

        // 🔎 Check which GitHub account this token belongs to
        try {
            const userCheck = await axios.get("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Token belongs to:", userCheck.data.login);
        } catch (err) {
            console.log("Token check failed:", err.response?.data || err.message);
        }

        const filePath = "README.md";

        // 3️⃣ Check if README exists
        let sha;
        const getFileRes = await axios.get(
            `https://api.github.com/repos/${repoName}/contents/${filePath}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json',
                },
                validateStatus: status => status === 200 || status === 404
            }
        );

        if (getFileRes.status === 200) {
            sha = getFileRes.data.sha;
            console.log("Existing README found. SHA:", sha);
        } else {
            console.log("README does not exist. Creating new file.");
        }

        // 4️⃣ Push README
        const updateRes = await axios.put(
            `https://api.github.com/repos/${repoName}/contents/${filePath}`,
            {
                message: "Update README via AI Generator",
                content: Buffer.from(entity.content).toString('base64'),
                sha,
                branch: "main"   // 👈 ADD HERE
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json',
                },
            }
        );

        console.log("Push success:", updateRes.data.content.html_url);

        res.json({
            success: true,
            message: "README pushed successfully",
            html_url: updateRes.data.content.html_url
        });

    } catch (error) {
        console.error("Push Error:", error.response?.data || error.message);

        res.status(500).json({
            message: "Failed to push README",
            error: error.response?.data || error.message
        });
    }
};