import { Router } from 'express';
import assign from './assign';
import join from './join';
import migrate from './migrate';

const router = Router();

router.use('/assign', assign);
router.use('/join', join);
router.use('/migrate', migrate);

export default router;
