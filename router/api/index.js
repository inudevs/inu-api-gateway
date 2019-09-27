import { Router } from 'express';

import defaultAPI from './default';
import { proxyMiddleware } from '../../middleware/proxy';

const router = Router();

router.use('/default', defaultAPI);

router.use('/:route', proxyMiddleware);
router.use('/:route/*', proxyMiddleware);

export default router;
