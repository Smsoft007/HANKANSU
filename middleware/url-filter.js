const logger = require('../lib/logger');

module.exports = urlFilter = (req, res, next) => {
  if (req.url.indexOf('.html') > -1) {
    res.end();
    return;
  }

  if (req.url.indexOf('.php') > -1) {
    res.end();
    return;
  }

  if (req.url == '/RequestDenied') {
    res.end();
  } else {
    if (req.url.indexOf('.') == -1) {
      logger.info('URL : ' + req.url);
    }
    next();
  }
};
