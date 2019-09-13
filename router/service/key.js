import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import ServiceKey from '../../models/service.key';

const router = Router();

// GET /service/key/{key}
router.get('/:key', asyncHandler(async (req, res, _) => {
  const { key } = req.params;
  const serviceKey = await ServiceKey.findById(key);
  return res.json(serviceKey);
}));

export default router;
