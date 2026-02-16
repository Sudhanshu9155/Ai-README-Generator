import express from 'express';
import { getUserRepos, getRepoDetails, getRepoContent, analyzeRepo } from '../controllers/githubController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all routes

router.get('/repos', getUserRepos);
router.get('/repos/:owner/:repo', getRepoDetails);
router.get('/content', getRepoContent);
router.post('/analyze', analyzeRepo);

export default router;
