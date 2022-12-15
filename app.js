require('./env');
const env = process.env;
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./lib/logger');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const appRoot = require('app-root-path');

const checkRSAKey = require('./middleware/check-rsa');
const urlFilter = require('./middleware/url-filter');
const responseJson = require('./middleware/responseJson');
const commonLib = require('./lib/commonLib.js');
const coin_helper = require('./lib/coin-helper');
const app = express();
const render = express.response.render;
const sessionStore = commonLib.getSessionStore();
const csrf = require('csurf');

const indexRouter = require('./routes/index');
const commonRouter = require('./routes/common');
const listRouter = require('./routes/list');
const usersRouter = require('./routes/users');
const ftpRouter = require('./routes/ftp');
const adminApiRouter = require('./routes/adminApi');
const wsModule = require('ws');

const webSocketServer = new wsModule.WebSocketServer({ port: 8080 });

webSocketServer.on('connection', function connection(ws) {
  ws.clients.forEach(function each(client) {
    console.log('Client.ID: ');
    console.log(client);
  });
});
// coin_helper.doTransaction("TK","TYJri7jtv4CDjVVWDj8BpgC7efoqcfeVVZ",0.001)
const lang = [
  require('./lib/lang-kr'),
  require('./lib/lang-en'),
  require('./lib/lang-ch'),
  require('./lib/lang-jp'),
];
app.use(
  session({
    secret: 'secreateKKKEY',
    resave: false,
    store: sessionStore,
    key: 'express.sid',
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
    saveUninitialized: false,
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(urlFilter);
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/include/',
  express.static(__dirname + '/views/include/', {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })
);
app.use(
  '/img/',
  express.static(__dirname + '/views/img/', {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })
);
app.use(
  '/scripts/',
  express.static(__dirname + '/views/scripts/', {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })
);
app.use(
  '/upload/',
  express.static(__dirname + '/temp/', {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })
);
app.use(
  '/favicon.ico',
  express.static(__dirname + '/views/img/favicon.ico', {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })
);
app.use(checkRSAKey);
app.use(responseJson);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: `${appRoot}/temp`,
    limits: { fileSize: 5000000 },
  })
);

app.use('/api/ftp', ftpRouter);

app.use('/admin', adminApiRouter);
app.use(
  csrf({
    cookie: true,
  })
);

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/common', commonRouter);
app.use('/api/list', listRouter);

express.response.render = function (view, options, callback) {
  if (commonLib.isNull(options)) {
    options = {};
  }
  var req = this.req;
  options['csrfToken'] = req.csrfToken();

  if (req.session.publickey == undefined) {
    options['publicKey'] = '';
  } else {
    options['publicKey'] = req.session.publickey;
  }

  if (req.session.num == undefined) {
    req.session.num = 0;
  }

  if (req.session.userInfo == undefined) {
    options['LOGIN'] = false;
  } else {
    options['LOGIN'] = req.session.userInfo['LOGIN'];
    options['D_UID'] = req.session.userInfo['D_UID'];
    options['IMAGE_URL'] = env.IMAGE_URL;
  }
  options['LANG'] = lang[req.session.num];

  render.call(this, view, options, callback);
};

process.on('uncaughtException', function (err) {
  console.log(' UNCAUGHT EXCEPTION ');
  console.log("[Inside 'uncaughtException' event] " + err.stack || err.message);
  logger.error(err);
});

module.exports = app;
