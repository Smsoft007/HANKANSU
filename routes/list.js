const express = require('express');
const router = express.Router();
const commonLib = require('../lib/commonLib');
const sqlHelper = require('../lib/mssql-helper');
const Response = require('../model/response');
const procedureNamse = require('../lib/procedure-info').procedureNames;

router.post('/addrlist', async (req, res, next) => {
  const returnData = [];
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  console.log(param);
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
    const address = PROCEDDATA.recordsets[0];
    for (let index = 0; index < address.length; index++) {
      const element = address[index];
      const qrcode = await commonLib.generateQRCode(element.ADDRESS);
      element['QRCODE'] = qrcode;
    }
    respose.setData(address);
  }
  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

router.post('/getCoinBalance', async (req, res, next) => {
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  param['D_UID'] = req.session.userInfo['D_UID'];
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
    respose.setData(PROCEDDATA.recordsets[0]);
    for (let i = 0; i < PROCEDDATA.recordsets[0].length; i++) {
      const element = PROCEDDATA.recordsets[0][i];
      req.session.userInfo[element.SNAME + '_ADDR'] = element.D_ADDR;
      if (element.D_ADDR)
        req.session.userInfo[element.SNAME + '_ADDR_QR'] =
          await commonLib.generateQRCode(element.D_ADDR);
    }
  }
  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

router.post('*', async (req, res, next) => {
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
    param['B_UID'] = param['D_UID'] || 'admin';
    param['IP_NO'] = commonLib.getClientIpAddress(req);
  } catch (e) {
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
  if (param['CNT']) {
    const CNT = await sqlHelper.callProcedure(
      procedureNamse[urlName].name + '_CNT',
      param
    );
    if (CNT == null) {
    } else {
      respose.setCnt(CNT.recordset[0]);
    }
  }
  if (PROCEDDATA) {
    respose.setData(PROCEDDATA.recordsets[0]);
  }
  respose.setName(procedureNamse[urlName].returnName);
  res.responseJson(respose);
});

module.exports = router;
