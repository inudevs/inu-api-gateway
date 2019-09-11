import express from 'express';
import auth from './auth';

const router = express.Router();

// GET /test
router.get('/test', function(_, res) {
  return res.json({
    test: true
  })
});

router.use('/auth', auth);

module.exports = router;
