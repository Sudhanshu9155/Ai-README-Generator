import express from 'express';
import { createReadme, getUserReadmes, getReadmeById, updateReadme, deleteReadme } from '../controllers/entityController.js';
// Assuming authMiddleware is somewhere, I need to check where it is.
// Based on file structure: backend/middleware/authMiddleware.js
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
    .post(createReadme)
    .get(getUserReadmes);

router.route('/:id')
    .get(getReadmeById)
    .put(updateReadme)
    .delete(deleteReadme);

export default router;
