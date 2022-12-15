require('../env');
const express = require('express');
const router = express.Router();
const commonLib = require('../lib/commonLib');
const sqlHelper = require('../lib/mssql-helper');
const Response = require('../model/response');
const NodeCache = require('node-cache');
const coinHelper = require('../lib/coin-helper');
const procedureNamse = require('../lib/procedure-info').procedureNames;

router.post('/coinSendList', async (req, res, next) => {
  const urlName = req.url.replace('/', '');
  const respose = new Response();
  const param = commonLib.decryptAll(req);
  const adminIp = commonLib.getClientIpAddress(req);
  if (adminIp === '127.0.0.1') {
    param['D_UID'] = req.body.USER_ID;
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
  } else {
    respose.setReturnCode(500);
    res.responseJson(respose);
  }
});

module.exports = router;
