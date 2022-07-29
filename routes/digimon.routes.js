import express from 'express';
import auth from '../middleware/auth.js';

import { getDigimons, createDigimon, updateDigimon, deleteDigimon, findById } from '../controllers/digimon.controller.js';

const router = express.Router();

router.get('/:id', findById);
router.post('/list', getDigimons);
router.post('/', auth, createDigimon);
router.patch('/:id', auth, updateDigimon);
router.delete('/:id', auth, deleteDigimon);

export default router;