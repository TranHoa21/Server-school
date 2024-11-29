import { Router } from 'express';
import express from 'express';
import uploadCloud from '../middleware/cloudinary.js'

import * as controllers from '../controllers/index.js'

const router = Router();

router.use(express.json());

router.post('/', controllers.creatUser);
router.get('/', controllers.getAllUser);
router.get('/:id', controllers.getUserById);
router.put('/:id', uploadCloud.single('file'), controllers.updateUser);
router.delete('/:id', controllers.deleteUser);




export default router;
