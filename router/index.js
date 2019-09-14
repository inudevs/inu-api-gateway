import express from 'express';
import auth from './auth';
import service from './service';
import user from './user';

const router = express.Router();

// GET /test
router.get('/test', function(_, res) {
  return res.json({
    test: true
  })
});

router.use('/auth', auth);
router.use('/service', service);
router.use('/user', user);

module.exports = router;
