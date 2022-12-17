const express = require('express');
const router = express.Router();
const Response = require('../model/response');

router.get('/apitk/:txid', async (req, res, next) => {
  let { txid } = req.params;
  res.send('');
});

module.exports = router;
