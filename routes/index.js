var express = require('express');
var router = express.Router();

// const tr = require("googletrans").default;
// const lang_kr = require("../lib/lang-kr");
// const lang_en = require("../lib/lang-en");
// const lang_ch = require("../lib/lang-ch");
// const lang_jp = require("../lib/lang-jp");

// router.get("/translate", async function (req, res, next) {
//   let lang = {};
//   const keys = Object.keys(lang_en)
//   // const keys = Object.keys(lang_kr);
//   for (let i = 0; i < keys.length; i++) {
//     const key = keys[i];
//     try {
//       const result = await tr(lang_en[key], { from: "en", to: "zh-CN" });
//       // const result = await tr(lang_kr[key], { from: "ko", to: "en" });
//       lang[key] = result.text;
//       console.log((i+1),"/",keys.length);
//     } catch (error) {
//       console.log(error);
//       lang[key] = lang_en[key]
//       // lang[key] = lang_kr[key];
//     }
//   }

//   res.json(lang);
// });

router.post('/lang', function (req, res, next) {
  const num = req.query.num;
  if (num != undefined) {
    req.session.num = num;
  }
  res.send('lang');
});

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
    res.render('index', {
      R_UID: R_UID,
      LOGINALERT: false,
    });
    return;
  }
  if (urlName.indexOf('findpass') != -1) {
    res.render('findpass');
    return;
  }
  if (urlName.indexOf('notice') != -1) {
    res.render('notice');
    return;
  }
  if (urlName.indexOf('index') != -1) {
    res.render('signin');
    return;
  }
  if (urlName.indexOf('main') != -1) {
    res.render('main');
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
    res.render('main', { LOGINALERT: 'true' });
    return;
  }
  res.render(urlName);
});

module.exports = router;
