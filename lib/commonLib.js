'use strict';
require('../env');
const env = process.env;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const NodeCache = require('node-cache');
const logger = require('./logger');
const sqlHelper = require('./mssql-helper');
const curl = require('curl');
const cryptico = require('cryptico');
const moment = require('moment');
const commonLib = require('./commonLib');
const qrcode = require('qrcode');
const axios = require('axios');
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 300 });
const infobip = require('./infobip');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
let app;
let sessionStore;
let io;

exports.getOTPSecret = () => {
  return speakeasy.generateSecret({
    length: 20,
    name: 'Global Bit',
    issuer: 'admin',
  });
};
exports.createOtpQr = async (secretAscii) => {
  const url = speakeasy.otpauthURL({
    secret: secretAscii,
    issuer: 'Global Bit',
    label: 'admin',
    algorithm: 'sha512',
    period: 300,
  });
  const qrData = await QRCode.toDataURL(url);
  return qrData;
};

exports.otpverify = async (secretBase32, token) => {
  const verified = speakeasy.totp.verify({
    secret: secretBase32,
    encoding: 'base32',
    token: token,
  });

  return verified;
};
exports.sendSms = async (msg, hp) => {
  infobip.sendSms(msg, hp);
};
exports.getCoinPrice = async () => {
  const returnData = {};
  const rate_btc = await commonLib.getApi(env.RATE_BTC);
  const rate_eth = await commonLib.getApi(env.RATE_ETH);
  const rate_ltc = await commonLib.getApi(env.RATE_LTC);
  returnData['BTC'] = rate_btc.USD;
  returnData['ETH'] = rate_eth.USD;
  returnData['LTC'] = rate_ltc.USD;
  myCache.set(cacheKey, returnData);
};

exports.initialize = () => {
  app = require('../app');
  sessionStore = app.sessionStore;
  io = app.io;
  commonLib.getCoinPrice();
};

exports.getRandomPwd = () => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn~!@#$%^&*opqrstuvwxyz0123456789';
  for (let i = 0; i < Math.floor(Math.random() * (18 - 10 + 1) + 10); i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

exports.getCountryCode = async (req) => {
  const ipNo = commonLib.getClientIpAddress(req);

  const arrIp = ipNo.split('.');
  const ip1 = parseInt(arrIp[0]) * 16777216;
  const ip2 = parseInt(arrIp[1]) * 65536;
  const ip3 = parseInt(arrIp[2]) * parseInt(arrIp[3]);
  let Params = {};
  Params['IPNO'] = ip1 + ip2 + ip3;

  const result = await sqlHelper.callProcedure('SP_C_IPCHECK', Params);
  if (result == null) {
    return null;
  } else {
    return result.recordset[0].NAME;
  }
};

const timer = () => {};

timer.prototype = {
  start: () => {
    this._time = moment(new Date().getTime());
  },
  end: () => {
    return moment(new Date().getTime()).diff(this._time);
  },
};
exports.timer = timer;

exports.promiseTimeout = (ms, promise) => {
  var timeout = new Promise((resolve, reject) => {
    var id = setTimeout(() => {
      clearTimeout(id);
      logger.error('Promise Timeout in ' + ms + 'ms.');
      reject('timeout');
    }, ms);
  });
  return Promise.race([promise, timeout]);
};

exports.getSessionStore = () => {
  let redis = null,
    redisClient = null,
    RedisStore = null;
  //Redis
  if (false) {
    redis = require('redis');
    redisClient = redis.createClient('5432', 'localhost');
    return;
    new RedisStore({
      client: redisClient,
      ttl: 260,
    });
  } else {
    return new session.MemoryStore();
  }
};

exports.SystemErrorHandling = (req, res) => {
  logger.info('SystemErrorHandling');
  const num = req.session.num;
  const returnData = {};
  returnData['success'] = false;
  returnData['message'] = 'Session Out';

  res.json(returnData);
};

exports.isNull = (value) => {
  if (
    value === '' ||
    value === undefined ||
    value === null ||
    value === false
  ) {
    return true;
  } else {
    return false;
  }
};

exports.procedureParamIsNull = (value) => {
  if (value === undefined || value === null || value === false) {
    return true;
  } else {
    return false;
  }
};

exports.getClientIpAddress = (req) => {
  let ipAddress;
  const forwardedIpsStr = req.header('x-real-ip');
  if (forwardedIpsStr) {
    const forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress.replace('::ffff:', '');
  }
  return ipAddress;
};

exports.numberConvert = (value, count) => {
  value = parseFloat(value) + '';
  if (isNaN(value)) {
    return null;
  }
  if (value.indexOf('.') > -1) {
    const pos = value.substring(0, value.indexOf('.'));
    const dec = value.substring(value.indexOf('.') + 1, value.length);
    const decLength = count - dec.length;
    if (dec.length < count) {
      for (let i = 0; i < decLength; i++) {
        dec = dec + '0';
      }
    }
    value = value.indexOf('.') == 1 && pos == '0' ? dec : pos + dec;
  } else {
    for (let i = 0; i < count; i++) {
      value = value + '0';
    }
  }
  return value;
};

exports.checkDuplicateLogin = (req, userId) => {
  const sessions = sessionStore.sessions;

  const sessionKeys = Object.keys(sessionStore.sessions);
  let userInfo;
  let returnValue = 0;
  let alreadyLoginedUserSocket;
  for (let i = 0; i < sessionKeys.length; i++) {
    userInfo = JSON.parse(sessions[sessionKeys[i]]).userInfo;

    if (userInfo == undefined) {
      continue;
    }
    if (req.sessionID == sessionKeys[i]) {
      alreadyLoginedUserSocket = userInfo.socket;
      if (userInfo.socket == undefined) {
        break;
      }
      if (userInfo['D_UID'] == userId) {
        returnValue = 4;
        break;
      }
      returnValue = 5;
      break;
    } else {
      if (userInfo['D_UID'] == userId) {
        alreadyLoginedUserSocket = userInfo.socket;
        if (userInfo.socket == undefined) {
          sessionStore.destroy(sessionKeys[i], (err) => {});
          break;
        }
        io.sockets
          .in(alreadyLoginedUserSocket)
          .emit('duplicate-login-detection', {
            message: 'duplicate-login-detection',
          });
        returnValue = 6;
        break;
      }
    }
  } // for
  return returnValue;
};

exports.toMoneyFormat = (value) => {
  value = value + '';
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

exports.generateQRCode = (value) => {
  return new Promise((resolve, reject) => {
    qrcode
      .toDataURL(value)
      .then((url) => {
        resolve(url);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.callApi = (url, data, option) => {
  logger.info('start callApi : ' + url);
  return new Promise((resolve, reject) => {
    curl.postJSON(url, data, option, (err, response, data) => {
      if (err) {
        logger.error('callApi : ' + err);
        reject(err);
      } else {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          resolve(data);
        }
      }
    });
  });
};
exports.loginCheck = (req, res) => {
  const returnData = {};
  logger.info('never Login');
  returnData['notLogined'] = true;
  res.json(returnData);
};

exports.decryptAll = (req) => {
  logger.info('start decryptAll..');
  const RSAKey = cryptico.RSAKey.parse(req.session.rsakey);
  const body = req.body;
  const decryptValues = {};
  let name;
  for (name in body) {
    const plaintext = cryptico.decrypt(body[name], RSAKey).plaintext;
    if (plaintext) decryptValues[name] = plaintext;
    else decryptValues[name] = body[name];
  }
  return decryptValues;
};

exports.sendMsgBySocket = (userId, msg, data) => {
  const sessions = sessionStore.sessions;
  const sessionKeys = Object.keys(sessionStore.sessions);
  let userInfo;
  let returnValue = 0;
  let alreadyLoginedUserSocket;
  for (let i = 0; i < sessionKeys.length; i++) {
    userInfo = JSON.parse(sessions[sessionKeys[i]]).userInfo;

    console.log(userInfo);
    if (userInfo == undefined) {
      continue;
    }
    if (userInfo['D_UID'] == undefined) {
      continue;
    }
    if (userInfo['D_UID'].toLowerCase() == userId.toLowerCase()) {
      alreadyLoginedUserSocket = userInfo.socket;
      io.sockets.in(alreadyLoginedUserSocket).emit(msg, {
        message: data,
      });
    }
  } // for
  return returnValue;
};

exports.getApi = (url, param) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, param)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};
