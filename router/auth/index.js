import { Router } from 'express';
import assign from './assign';
import join from './join';
import login from './login';
import migrate from './migrate';

const router = Router();

router.use('/assign', assign);
router.use('/join', join);
router.use('/login', login);
router.use('/migrate', migrate);

export default router;
