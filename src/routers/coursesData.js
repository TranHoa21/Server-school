import { Router } from 'express';
import express from 'express';
import multer from 'multer';

import uploadCloud from '../middleware/cloudinary.js'

import * as controllers from '../controllers/index.js'


const router = Router();

router.use(express.json());

router.post('/', uploadCloud.array('file'), controllers.createCoursesData);
router.get('/', controllers.allCoursesData);
router.get('/:coursesDataLink', controllers.getCoursesDataByLink);
router.put('/:coursesDataLink', uploadCloud.array('file'), controllers.updateCoursesData);
router.delete('/:coursesDataId', controllers.deleteCoursesData);






export default router;