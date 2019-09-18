import { Router } from 'express';
import defaultAPI from './default';

const router = Router();

router.use('/default', defaultAPI);

export default router;
