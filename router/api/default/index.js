import { Router } from 'express';
import student from './student';

const router = Router();

router.use('/student', student);

export default router;
