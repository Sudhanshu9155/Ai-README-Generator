
import express from 'express';
import { listRepos, analyzeRepo, pushToRepo} from '../controllers/githubController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/repos', protect, listRepos);
router.post('/analyze', protect, analyzeRepo);

// Push README endpoints
router.post('/push', protect, pushToRepo);

export default router;
