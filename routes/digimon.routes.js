import express from 'express';

import { getPosts, createPost, updatePost, deletePost, findById } from '../controllers/digimon.controller.js';

const router = express.Router();

router.get('/:id', findById);
router.get('/', getPosts);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;