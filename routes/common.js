require('../env');
const express = require('express');
const router = express.Router();
const commonLib = require('../lib/commonLib');
const sqlHelper = require('../lib/mssql-helper');
const Response = require('../model/response');
const NodeCache = require('node-cache');
const coinHelper = require('../lib/coin-helper');
const procedureNamse = require('../lib/procedure-info').procedureNames;
const env = process.env;
const myCache = new NodeCache({ stdTTL: 3000, checkperiod: 3000 });
router.post('/sendSMS', async (req, res, next) => {
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  param['D_SESSION'] = req.sessionID;
  param['D_IP'] = commonLib.getClientIpAddress(req);

  const PROCEDDATA = await sqlHelper.callProcedure(
    procedureNamse[urlName].name,
    param
  );

  if (PROCEDDATA) {
    console.log(PROCEDDATA.recordset[0].SMS_CODE);
    respose.setData({
      RESULT: PROCEDDATA.recordset[0].RESULT,
      CUR_KEY: PROCEDDATA.recordset[0].CUR_KEY,
    });
    commonLib.sendSms(
      `Certification Number Is : ${PROCEDDATA.recordset[0].SMS_CODE}`,
      param['D_HP']
    );
  }

  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

router.post('/getOTPQrcode', async (req, res, next) => {
  const respose = new Response();

  const SECRETINFO = await sqlHelper.callProcedure('SP_OTP', {
    D_UID: req.session.userInfo['D_UID'],
  });

  const qrcode = await commonLib.createOtpQr(SECRETINFO.recordsets[0][0].O_ASC);

  respose.setData(qrcode);
  respose.setName('OTPQR');
  res.responseJson(respose);
});

router.post('/vertiyOTP', async (req, res, next) => {
  const respose = new Response();
  const param = commonLib.decryptAll(req);

  const SECRETINFO = await sqlHelper.callProcedure('SP_OTP', {
    D_UID: req.session.userInfo['D_UID'],
  });

  const r = await commonLib.otpverify(
    SECRETINFO.recordsets[0][0].O_BASKEY,
    param['OTPNUM']
  );
  respose.setData(r);
  respose.setName('VERTIFY');
  res.responseJson(respose);
});

router.post('/isAddress', async (req, res, next) => {
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  const r = await coinHelper.checkAddress(param['type'], param['address']);
  respose.setData(r);
  respose.setName('ISADDRESS');
  res.responseJson(respose);
});

router.post('/getCoinRate', async (req, res, next) => {
  let returnData = null;
  const cacheKey = 'COINRATE';
  const respose = new Response();
  returnData = myCache.get(cacheKey);
  if (!returnData) {
    returnData = {};
    const rate_btc = await commonLib.getApi(env.RATE_BTC);
    const rate_eth = await commonLib.getApi(env.RATE_ETH);
    const rate_ltc = await commonLib.getApi(env.RATE_LTC);
    returnData['BTC'] = rate_btc.USD * 1200;
    returnData['ETH'] = rate_eth.USD * 1200;
    returnData['LTC'] = rate_ltc.USD * 1200;
    returnData['TK'] = 1200;
    returnData['GTAC'] = 1200;

    myCache.set(cacheKey, returnData);
  }

  respose.setData(returnData);
  respose.setName('COINRATE');
  res.responseJson(respose);
});

router.post('/createAddr', async (req, res, next) => {
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);

  if (
    req.session.userInfo == undefined &&
    req.rawHeaders.indexOf('/front') != -1
  ) {
    commonLib.loginCheck(req, res);
    return;
  }

  param['D_UID'] = req.session.userInfo['D_UID'];
  if (param.CURR === 'ETH') {
    param['PASS'] = commonLib.getRandomPwd();
    param['ADDR'] = coinHelper.createEthAddress(param['PASS']);
  } else if (param.CURR === 'USD' || param.CURR === 'KRW') {
  } else if (param.CURR) {
    param['ADDR'] = await coinHelper.createCoinAddress(param.CURR);
  }

  const PROCEDDATA = await sqlHelper.callProcedure(
    procedureNamse[urlName].name,
    param
  );

  if (PROCEDDATA) {
    respose.setData(PROCEDDATA.recordset[0]);
  }
  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

router.post('/coinSendList', async (req, res, next) => {
  const returnData = {};
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  const adminIp = commonLib.getClientIpAddress(req);
  try {
    param['D_UID'] =
      param['D_UID'] == null
        ? req.session.userInfo == undefined
          ? ''
          : req.session.userInfo['D_UID']
        : param['D_UID'];
  } catch (e) {
    commonLib.SystemErrorHandling(req, res);
    returnData['returnValue'] = 100;
    return;
  }

  const PROCEDDATA = await sqlHelper.callProcedure(
    procedureNamse[urlName].name,
    param
  );

  if (PROCEDDATA) {
    let txidList = [];
    const sendList = PROCEDDATA.recordsets[0];
    for (let i = 0; i < sendList.length; i++) {
      try {
        const element = sendList[i];
        let result = await coinHelper.doTransaction(
          element.C_SNAME,
          element.AD_ADDR,
          element.QTY
        );
        let txPram = {};
        txPram['IDX'] = element.C_IDX;
        txPram['GUBUN'] = element.GUBUN;
        txPram['C_NO'] = element.C_NO;
        txPram['C_NAME'] = element.C_SNAME;
        txPram['C_QTY'] = element.QTY;
        txPram['ADDR'] = element.AD_ADDR;
        txPram['TXID'] = result.txid;
        txidList.push(txPram);
      } catch (error) {
        res.responseJson(respose);
        return;
      }
    }
    for (let i = 0; i < txidList.length; i++) {
      const element = txidList[i];
      const COINTXID = await sqlHelper.callProcedure('SP_COIN_TXID', element);
    }
    respose.setData(PROCEDDATA.recordsets[0]);
  }
  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

router.post('/coinTransfer', async (req, res, next) => {
  const returnData = {};
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  try {
    param['D_UID'] =
      param['D_UID'] == null
        ? req.session.userInfo == undefined
          ? ''
          : req.session.userInfo['D_UID']
        : param['D_UID'];
  } catch (e) {
    commonLib.SystemErrorHandling(req, res);
    returnData['returnValue'] = 100;
    return;
  }

  param['GUBUN'] = 'KRW';

  const PROCEDDATA = await sqlHelper.callProcedure(
    procedureNamse[urlName].name,
    param
  );

  if (PROCEDDATA) {
    const procResult = PROCEDDATA.recordset[0];
    if (procResult['RESULT'] == 0) {
      const result = await coinHelper.doTransaction(
        param['COIN'],
        param['TO_ADDR'],
        param['AMOUNT']
      );

      param['OUTKEY'] = procResult.OUTKEY;
      param['FEE'] = result.fee || 0;
      param['TXID'] = result.txid || ' ';
      param['RESULT'] = result.txid ? 0 : 9;
      await sqlHelper.callProcedure('SP_COIN_TRANSFER_COMPLETE', param);
    }
    respose.setData(procResult);
    // const sendList = PROCEDDATA.recordset[0];
    // for (let i = 0; i < sendList.length; i++) {
    //   const element = sendList[i];

    // }
  }
  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

router.post('/myCoinBuy', async (req, res, next) => {
  const returnData = {};
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  param['SESSION'] = req.sessionID;
  try {
    param['D_UID'] =
      param['D_UID'] == null
        ? req.session.userInfo == undefined
          ? ''
          : req.session.userInfo['D_UID']
        : param['D_UID'];
    param['B_UID'] = param['D_UID'] || 'admin';
    param['IP_NO'] = commonLib.getClientIpAddress(req);
  } catch (e) {
    console.log(e);
    commonLib.SystemErrorHandling(req, res);
    returnData['returnValue'] = 100;
    return;
  }
  if (param['TIME']) {
    returnData['TIME'] = new Date();
  }
  if (
    req.session.userInfo == undefined &&
    req.rawHeaders.indexOf('/front') != -1
  ) {
    commonLib.loginCheck(req, res);
    return;
  }

  const PROCEDDATA = await sqlHelper.callProcedure(
    procedureNamse[urlName].name,
    param
  );

  if (PROCEDDATA) {
    if (PROCEDDATA.recordset[0].RESULT === 0) {
      commonLib.sendSms(
        `Global Trade TK 판매 신청 건 구매 접수되었습니다`,
        `+82${+PROCEDDATA.recordset[0].S_HP}`
      );
    }
    respose.setData(PROCEDDATA.recordset[0]);
  }
  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

router.post('/deposit', async (req, res, next) => {
  const returnData = {};
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  param['SESSION'] = req.sessionID;
  try {
    param['D_UID'] =
      param['D_UID'] == null
        ? req.session.userInfo == undefined
          ? ''
          : req.session.userInfo['D_UID']
        : param['D_UID'];
    param['B_UID'] = param['D_UID'] || 'admin';
    param['IP_NO'] = commonLib.getClientIpAddress(req);
  } catch (e) {
    console.log(e);
    commonLib.SystemErrorHandling(req, res);
    returnData['returnValue'] = 100;
    return;
  }
  if (param['TIME']) {
    returnData['TIME'] = new Date();
  }
  if (
    req.session.userInfo == undefined &&
    req.rawHeaders.indexOf('/front') != -1
  ) {
    commonLib.loginCheck(req, res);
    return;
  }

  const PROCEDDATA = await sqlHelper.callProcedure(
    procedureNamse[urlName].name,
    param
  );

  if (PROCEDDATA) {
    // console.log(PROCEDDATA.recordset[0]);
    if (PROCEDDATA.recordset[0].RESULT === 0) {
      if (PROCEDDATA.recordset[0].GUBUN === 'BUY') {
        commonLib.sendSms(
          `${PROCEDDATA.recordset[0].USERID} 님의 구매건이 입금 요청 중 입니다.`,
          `+82${+PROCEDDATA.recordset[0].D_HP}`
        );
        commonLib.sendSms(
          `${PROCEDDATA.recordset[0].USERID} 님의 구매건이 입금 요청 중 입니다.`,
          `+82${+env.ADMIN_PH}`
        );
      } else {
        commonLib.sendSms(
          `${PROCEDDATA.recordset[0].USERID} 님의 판매건이 입금 확인 요청 중 입니다.`,
          `+82${+PROCEDDATA.recordset[0].D_HP}`
        );
        commonLib.sendSms(
          `${PROCEDDATA.recordset[0].USERID} 님의 판매건이 입금 확인 요청 중 입니다.`,
          `+82${+env.ADMIN_PH}`
        );
      }
    }
    respose.setData(PROCEDDATA.recordset[0]);
  }
  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

router.post('/myCoinSell', async (req, res, next) => {
  const returnData = {};
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  param['SESSION'] = req.sessionID;
  try {
    param['D_UID'] =
      param['D_UID'] == null
        ? req.session.userInfo == undefined
          ? ''
          : req.session.userInfo['D_UID']
        : param['D_UID'];
    param['B_UID'] = param['D_UID'] || 'admin';
    param['IP_NO'] = commonLib.getClientIpAddress(req);
  } catch (e) {
    console.log(e);
    commonLib.SystemErrorHandling(req, res);
    returnData['returnValue'] = 100;
    return;
  }
  if (param['TIME']) {
    returnData['TIME'] = new Date();
  }
  if (
    req.session.userInfo == undefined &&
    req.rawHeaders.indexOf('/front') != -1
  ) {
    commonLib.loginCheck(req, res);
    return;
  }

  const PROCEDDATA = await sqlHelper.callProcedure(
    procedureNamse[urlName].name,
    param
  );

  if (PROCEDDATA) {
    // console.log(PROCEDDATA.recordset[0]);
    if (PROCEDDATA.recordset[0].RESULT === 0) {
      commonLib.sendSms(
        `Global Trade TK 구매 신청 건 판매 접수되었습니다.`,
        `+82${+PROCEDDATA.recordset[0].B_HP}`
      );
    }
    respose.setData(PROCEDDATA.recordset[0]);
  }
  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

router.post('*', async (req, res, next) => {
  const returnData = {};
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  param['SESSION'] = req.sessionID;
  try {
    param['D_UID'] =
      param['D_UID'] == null
        ? req.session.userInfo == undefined
          ? ''
          : req.session.userInfo['D_UID']
        : param['D_UID'];
    param['B_UID'] = param['D_UID'] || 'admin';
    param['IP_NO'] = commonLib.getClientIpAddress(req);
  } catch (e) {
    console.log(e);
    commonLib.SystemErrorHandling(req, res);
    returnData['returnValue'] = 100;
    return;
  }
  if (param['TIME']) {
    returnData['TIME'] = new Date();
  }
  if (
    req.session.userInfo == undefined &&
    req.rawHeaders.indexOf('/front') != -1
  ) {
    commonLib.loginCheck(req, res);
    return;
  }

  const PROCEDDATA = await sqlHelper.callProcedure(
    procedureNamse[urlName].name,
    param
  );

  if (PROCEDDATA) {
    respose.setData(PROCEDDATA.recordset[0]);
  }
  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

module.exports = router;
