var express = require('express');
var router = express.Router();

router.post('/logout', function (req, res, next) {
  req.session.userInfo = null;
  req.session.destroy();
  res.render('index');
});
router.get('/', function (req, res, next) {
  const num = req.query.lang;
  if (num != undefined) {
    req.session.num = num;
  }
  res.render('index');
});

router.get('*', function (req, res, next) {
  let urlName = req.url.replace('/', '');
  if (urlName.indexOf('?') != -1) {
    urlName = urlName.substring(0, urlName.indexOf('?'));
  }
  if (urlName.indexOf('signup') != -1) {
    const R_UID = req.query.recId ? req.query.recId : '';
    res.render('signup', {
      R_UID: R_UID,
      LOGINALERT: false,
    });
    return;
  }
  if (urlName.indexOf('findpass') != -1) {
    res.render('findpass');
    return;
  }
  if (urlName.indexOf('signin') != -1) {
    res.render('signin');
    return;
  }
  if (urlName.indexOf('index') != -1) {
    res.render('index');
    return;
  }
  if (urlName.indexOf('authtest') != -1) {
    res.render('authtest');
    return;
  }
  if (urlName.indexOf('notice-view') != -1) {
    res.render('notice-view');
    return;
  }
  if (req.session.userInfo == undefined) {
    res.render('index', { LOGINALERT: 'true' });
    return;
  }
  res.render(urlName);
});

module.exports = router;
