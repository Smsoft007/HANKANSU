const express = require('express');
const router = express.Router();
const commonLib = require('../lib/commonLib');
const sqlHelper = require('../lib/mssql-helper');
const Response = require('../model/response');
const procedureNamse = require('../lib/procedure-info').procedureNames;
/* GET users listing. */

router.post('/signout', async (req, res, next) => {
  const respose = new Response();
  req.session.userInfo = null;
  req.session.destroy();
  res.responseJson(respose);
});

router.post('/index', async (req, res, next) => {
  const param = commonLib.decryptAll(req);
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  param['D_IP'] = commonLib.getClientIpAddress(req);
  param['sessionID'] = req.sessionID;
  const PROCEDDATA = await sqlHelper.callProcedure(
    procedureNamse[urlName].name,
    param
  );
  if (PROCEDDATA.recordset[0].RESULT == 'Y') {
    const MALANCEPRC = await sqlHelper.callProcedure('SP_MY_COIN_BALANCE', {
      D_UID: param.inUser_ID,
    });

    const SECRETINFO = await sqlHelper.callProcedure('SP_OTP', {
      D_UID: param.inUser_ID,
    });

    if (SECRETINFO.recordsets[0].length == 0) {
      const secret = await commonLib.getOTPSecret();
      await sqlHelper.callProcedure('SP_OTP_KEY', {
        D_UID: param.inUser_ID,
        ASCKEY: secret.ascii,
        BASKEY: secret.base32,
      });
    }

    const coinInfo = MALANCEPRC.recordsets[0];
    req.session.userInfo = {
      D_UID: param.inUser_ID,
      LOGIN: true,
    };
    for (let i = 0; i < coinInfo.length; i++) {
      const element = coinInfo[i];
      req.session.userInfo[element.SNAME + '_ADDR'] = element.D_ADDR;
      if (element.D_ADDR)
        req.session.userInfo[element.SNAME + '_ADDR_QR'] =
          await commonLib.generateQRCode(element.D_ADDR);
    }
  }

  respose.setName(procedureNamse[urlName].returnName);
  respose.setData(PROCEDDATA.recordset[0]);
  res.responseJson(respose);
});

router.post('*', async (req, res, next) => {
  const param = commonLib.decryptAll(req);
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  param['D_IP'] = commonLib.getClientIpAddress(req);
  param['sessionID'] = req.sessionID;
  param['SESSION'] = req.sessionID;
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
