
import axios from 'axios';
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import MainEntity from '../models/MainEntity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAX_ANALYSIS_FILES = 5000;

const skipDirs = new Set([
    '.git',
    'node_modules',
    'vendor',
    'dist',
    'build',
    '.next',
    '.nuxt',
    'coverage',
    '.cache',
    '.idea',
    '.vscode'
]);

const collectRepoFiles = (rootDir) => {
    const files = [];
    const stack = [rootDir];

    while (stack.length && files.length < MAX_ANALYSIS_FILES) {
        const current = stack.pop();
        const entries = fs.readdirSync(current, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

            if (entry.isDirectory()) {
                if (!skipDirs.has(entry.name.toLowerCase())) {
                    stack.push(fullPath);
                }
                continue;
            }

            files.push(relativePath);
            if (files.length >= MAX_ANALYSIS_FILES) break;
        }
    }

    return files;
};

const parseJsonIfExists = (filePath) => {
    if (!fs.existsSync(filePath)) return null;
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return null;
    }
};

const inferTechStack = (repoDir) => {
    const files = collectRepoFiles(repoDir);
    const normalized = files.map(f => f.toLowerCase());
    const stack = new Set();

    const hasExt = (ext) => normalized.some(f => f.endsWith(ext));
    const hasFile = (filename) => normalized.includes(filename.toLowerCase());
    const hasPathPart = (part) => normalized.some(f => f.includes(part.toLowerCase()));
    const hasSuffix = (suffix) => normalized.some(f => f.endsWith(suffix.toLowerCase()));

    if (hasExt('.php') || hasFile('composer.json')) stack.add('PHP');
    if (hasExt('.html') || hasExt('.htm')) stack.add('HTML');
    if (hasExt('.css') || hasExt('.scss') || hasExt('.sass') || hasExt('.less')) stack.add('CSS');
    if (hasExt('.ts') || hasExt('.tsx')) stack.add('TypeScript');
    if (hasExt('.js') || hasExt('.jsx') || hasFile('package.json')) stack.add('JavaScript');
    if (hasExt('.py') || hasFile('requirements.txt') || hasFile('pyproject.toml')) stack.add('Python');
    if (hasExt('.java') || hasFile('pom.xml') || hasFile('build.gradle')) stack.add('Java');
    if (hasExt('.go') || hasFile('go.mod')) stack.add('Go');
    if (hasExt('.rs') || hasFile('cargo.toml')) stack.add('Rust');
    if (hasExt('.rb') || hasFile('gemfile')) stack.add('Ruby');
    if (hasExt('.cs') || hasSuffix('.csproj') || hasSuffix('.sln')) stack.add('C#');
    if (hasFile('dockerfile') || hasPathPart('/dockerfile') || hasFile('docker-compose.yml') || hasFile('docker-compose.yaml')) stack.add('Docker');

    const packageJson = parseJsonIfExists(path.join(repoDir, 'package.json'));
    if (packageJson) {
        const deps = {
            ...(packageJson.dependencies || {}),
            ...(packageJson.devDependencies || {})
        };
        const depNames = Object.keys(deps).map(d => d.toLowerCase());
        const hasDep = (dep) => depNames.includes(dep);

        if (hasDep('react')) stack.add('React');
        if (hasDep('next')) stack.add('Next.js');
        if (hasDep('vue')) stack.add('Vue');
        if (hasDep('angular') || hasDep('@angular/core')) stack.add('Angular');
        if (hasDep('svelte')) stack.add('Svelte');
        if (hasDep('express')) stack.add('Express');
        if (hasDep('nestjs') || hasDep('@nestjs/core')) stack.add('NestJS');
        if (hasDep('mongoose') || hasDep('mongodb')) stack.add('MongoDB');
        if (hasDep('prisma')) stack.add('Prisma');
        if (hasDep('typeorm')) stack.add('TypeORM');
        if (hasDep('tailwindcss')) stack.add('Tailwind CSS');
    }

    const composerJson = parseJsonIfExists(path.join(repoDir, 'composer.json'));
    if (composerJson) {
        const deps = {
            ...(composerJson.require || {}),
            ...(composerJson['require-dev'] || {})
        };
        const depNames = Object.keys(deps).map(d => d.toLowerCase());

        if (depNames.some(d => d.includes('laravel'))) stack.add('Laravel');
        if (depNames.some(d => d.includes('symfony'))) stack.add('Symfony');
        if (depNames.some(d => d.includes('codeigniter'))) stack.add('CodeIgniter');
    }

    return Array.from(stack);
};

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

        // Analyze repository structure and manifests to infer real stack.
        const techStack = inferTechStack(tempDir);
        let description = '';
        let projectTitle = repoName || '';

        const packageJsonPath = path.join(tempDir, 'package.json');
        const pkg = parseJsonIfExists(packageJsonPath);
        if (pkg) {
            if (pkg.description) description = pkg.description;
            if (pkg.name) projectTitle = pkg.name;
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
            techStack,
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
