import { Router } from 'express';
import express from 'express';

import * as controllers from '../controllers'

const router = Router();

router.use(express.json());

router.post('/signup', controllers.signup)
router.post('/login', controllers.loginController)
router.post('/send-verification-email', controllers.sendVerificationEmailController);
router.post('/verify-password-reset-code', controllers.verifyPasswordResetCodeController);
router.post('/update-password', controllers.updatePassword);


export default router;
