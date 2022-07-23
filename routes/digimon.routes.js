import express from 'express';
import auth from '../middleware/auth.js';

import { getPosts, createPost, updatePost, deletePost, findById } from '../controllers/digimon.controller.js';

const router = express.Router();

router.get('/:id', findById);
router.post('/', getPosts);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

export default router;