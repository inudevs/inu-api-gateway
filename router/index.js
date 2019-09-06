const express = require('express');
const router = express.Router();

// GET /test
router.get('/test', function(req, res, next) {
  res.json({
    test: true
  })
});

module.exports = router;
