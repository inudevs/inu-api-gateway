import { Router } from 'express';
import assign from './assign';
import join from './join';

const router = Router();

router.use('/assign', assign);
router.use('/join', join);

export default router;
