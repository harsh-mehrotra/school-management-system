import express from 'express';
import { checkProtected, Login } from '../controller/authController.js';

const router = express.Router();

router.post('/login', Login);
router.get('/check-auth', checkProtected);

export default router;

