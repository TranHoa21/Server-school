import { Router } from 'express';
import express from 'express';
import multer from 'multer';

import uploadCloud from '../middleware/cloudinary.js'

import * as controllers from '../controllers/index.js'


const router = Router();

router.use(express.json());

router.post('/', uploadCloud.array('file'), controllers.createCourses);
router.get('/', controllers.allCourses);
router.get('/:coursesLink', controllers.getCoursesByLink);
router.put('/:CoursesLink', uploadCloud.array('file'), controllers.updateCourses);
router.delete('/:CoursesId', controllers.deleteCourses);






export default router;