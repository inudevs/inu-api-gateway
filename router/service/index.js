import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import Service from '../../models/service';
import { authMiddleware } from '../../middleware/auth';
import { inuCheckMiddleware } from '../../middleware/privileges';
import key from './key.js';

const router = Router();

router.use('/', [
  authMiddleware,
  inuCheckMiddleware
]);

// register router for key
router.use('/key', key);

// GET /service
router.get('/', asyncHandler(async (req, res, _) => {
  const services = await Service.find({});
  return res.json(services);
}));

// POST /service
router.post('/', asyncHandler(async (req, res, _) => {
  const { service } = req.body;

  // 키 존재 여부 검증
  ;['name', 'route', 'proxy', 'api'].map((key) => {
    if (!Object(service).hasOwnProperty(key)) {
      return res.status(400).json({
        message: `Field 'service.${key}' required`,
      });
    }
  });

  // proxy가 켜져 있는 경우, api 경로는 null이 아니여야 함
  if (service.proxy && !service.api) {
    return res.status(400).json({
      message: "Value of 'service.api' is required because 'service.proxy' is true",
    });
  }

  try {
    const serviceID = await Service.create(service);
    return res.json({
      id: serviceID,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}));

// GET /service/{serviceID}
router.get('/:serviceID', asyncHandler(async (req, res, _) => {
  const { serviceID } = req.params;
  const service = await Service.findById(serviceID);

  if (!service) {
    return res.status(404).json({
      message: '주어진 id를 가진 서비스가 없습니다.',
    });
  }
  return res.json(service);
}));

// GET /service/{serviceID}/key
router.get('/:serviceID/key', asyncHandler(async (req, res, _) => {
  const { serviceID } = req.params;
  const service = await Service.findById(serviceID);
  if (!service) {
    return res.status(404).json({
      message: '주어진 id를 가진 서비스가 없습니다.',  
    });
  }

  const serviceKeys = await service.getServiceKeys();
  return res.json(serviceKeys);
}));

// POST /service/{serviceID}/key
router.post('/:serviceID/key', asyncHandler(async (req, res, _) => {
  const { serviceID } = req.params;
  const service = await Service.findById(serviceID);
  if (!service) {
    return res.status(404).json({
      message: '주어진 id를 가진 서비스가 없습니다.',  
    });
  }

  const key = await service.newServiceKey();
  return res.json({
    key,
  });
}));

export default router;
