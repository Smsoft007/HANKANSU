'use strict';
const sql = require('mssql');
const procedureNames = {};

function ProcedureInfo() {}
ProcedureInfo.prototype.setProcedureInfo = (procedureName, procedureInfo) => {
  this[procedureName] = procedureInfo;
};

ProcedureInfo.prototype.getProcedureInfo = (procedureName) => {
  return this[procedureName];
};
const procedureInfo = new ProcedureInfo();

let currentName = 'SP_LOGIN';
let currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(50),
      required: true,
    },
    {
      name: 'D_PASS',
      type: sql.NVarChar(50),
      required: true,
    },
    {
      name: 'D_IP',
      type: sql.NVarChar(20),
      required: true,
    },
    {
      name: 'D_BROWSER',
      type: sql.VarChar(20),
      required: true,
    },
    {
      name: 'D_OS',
      type: sql.VarChar(50),
      required: true,
    },
    {
      name: 'IS_APP',
      type: sql.VarChar(50),
      required: true,
    },
    {
      name: 'CENTER',
      type: sql.VarChar(50),
      required: true,
    },
    {
      name: 'sessionID',
      type: sql.VarChar(50),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['signin'] = {
  name: currentName,
  returnName: 'SIGNIN',
};

currentName = 'MainboardList';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'SECHER_TEXT',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'CUR_PAGING',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'PAGING_NO',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['MainboardList'] = {
  name: currentName,
  returnName: 'MAINBOARD_LIST',
};

currentName = 'SP_MY_DESPOSIT';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'SNAME',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'STAN_COIN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'SELL_KEY',
      type: sql.Int,
      required: true,
    },
    {
      name: 'BUY_KEY',
      type: sql.Int,
      required: true,
    },
    {
      name: 'FILE_PATH',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['deposit'] = {
  name: currentName,
  returnName: 'DEPOSIT',
};

currentName = 'SP_MY_INFO';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['userinfo'] = {
  name: currentName,
  returnName: 'USERINFO',
};

currentName = 'SP_COIN_SEND';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'TO_ADDR',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_IDX',
      type: sql.Int,
      required: true,
    },
    {
      name: 'S_IDX',
      type: sql.Int,
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['coinSend'] = {
  name: currentName,
  returnName: 'COINSEND',
};

currentName = 'SP_COIN_SEND_LIST';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_IDX',
      type: sql.Int,
      required: true,
    },
    {
      name: 'S_IDX',
      type: sql.Int,
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['coinSendList'] = {
  name: currentName,
  returnName: 'COINSENDLIST',
};

currentName = 'SP_COIN_TXID';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'IDX',
      type: sql.Int,
      required: true,
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'C_NO',
      type: sql.Int,
      required: true,
    },
    {
      name: 'C_NAME',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'C_QTY',
      type: sql.Decimal(18, 8),
      required: true,
    },
    {
      name: 'ADDR',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'TXID',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_OTP';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(150),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COIN_TRANSFER_COMPLETE';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'OUTKEY',
      type: sql.Int,
      required: true,
    },
    {
      name: 'TXID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'RESULT',
      type: sql.Int,
      required: true,
    },
    {
      name: 'FEE',
      type: sql.Decimal(18, 8),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_OTP_KEY';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(150),
      required: true,
    },
    {
      name: 'ASCKEY',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'BASKEY',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_COUNTRY';
currentInfo = {
  usingCache: false,
  params: [],
};

procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['getCountry'] = {
  name: currentName,
  returnName: 'GETCOUNTRY',
};

currentName = 'SP_COIN_LIST';
currentInfo = {
  usingCache: false,
  params: [],
};

procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['getCoinList'] = {
  name: currentName,
  returnName: 'COINLIST',
};

currentName = 'SP_PW_CHAGNE';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'CUR_PW',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'NEW_PW',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_IDX',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['passwodChange'] = {
  name: currentName,
  returnName: 'PASSWODCHANGE',
};

currentName = 'SP_COIN_ORDER';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'CON_TYPE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'STAN_COIN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'ORDER_COIN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'RATE_TYPE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'RATE',
      type: sql.Decimal(18, 2),
      required: true,
    },
    {
      name: 'QTY',
      type: sql.Decimal(18, 2),
      required: true,
    },
    {
      name: 'AMOUNT',
      type: sql.Decimal(18, 2),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['coinOrder'] = {
  name: currentName,
  returnName: 'COINORDER',
};

currentName = 'SP_COIN_ADDR_LIST';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['addrlist'] = {
  name: currentName,
  returnName: 'ADDRLIST',
};

currentName = 'SP_BANK_LIST';
currentInfo = {
  usingCache: false,
  params: [],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['getBankList'] = {
  name: currentName,
  returnName: 'BANKLIST',
};

currentName = 'SP_COIN_TRANSFER';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'TO_ADDR',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'AMOUNT',
      type: sql.Decimal(18, 8),
      required: true,
    },
    {
      name: 'GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'COIN',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['coinTransfer'] = {
  name: currentName,
  returnName: 'COINTRANSFER',
};

currentName = 'SP_BUY_LIST';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'SNAME',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'STAN_COIN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'QGUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'TORDER',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'ORDER',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['buyList'] = {
  name: currentName,
  returnName: 'BUYLIST',
};

currentName = 'SP_SELL_LIST';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'SNAME',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'STAN_COIN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'QGUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'TORDER',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'ORDER',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['sellList'] = {
  name: currentName,
  returnName: 'sellList',
};

currentName = 'SP_MY_COIN_SELL';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'B_SEQ',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'BUY_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'SELL_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'SNAME',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'STAN_SNAME',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['myCoinSell'] = {
  name: currentName,
  returnName: 'MYCOINSELL',
};

currentName = 'SP_MY_COIN_BUY';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'S_SEQ',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'BUY_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'SELL_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'SNAME',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'STAN_SNAME',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['myCoinBuy'] = {
  name: currentName,
  returnName: 'MYCOINBUY',
};

currentName = 'SP_BOARD_MAIN_VIEW';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'B_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_IDX',
      type: sql.Int,
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['boardView'] = {
  name: currentName,
  returnName: 'BOARDVIEW',
};

currentName = 'SP_MY_TRADE_LIST';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_STATUS',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'T_GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true,
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['myTradeList'] = {
  name: currentName,
  returnName: 'MYTRADELIST',
};

currentName = 'SP_MY_TRADE_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_STATUS',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'T_GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BOARD_MAIN_LIST';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'B_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'IP_NO',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true,
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true,
    },
    {
      name: 'MY_NOTICE',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['boardList'] = {
  name: currentName,
  returnName: 'BOARDLIST',
};

currentName = 'SP_BOARD_MAIN_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'B_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'IP_NO',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'MY_NOTICE',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_MY_WALLET_INOUT_LIST';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'CUR_PAGING',
      type: sql.Int,
      required: true,
    },
    {
      name: 'PAGING_NO',
      type: sql.Int,
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['walletList'] = {
  name: currentName,
  returnName: 'WALLETLIST',
};

currentName = 'SP_MY_WALLET_INOUT_LIST_CNT';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_SDATE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_EDATE',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);

currentName = 'SP_BOARD_USER_WRITE';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'B_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_GUBUN',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_TITLE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_CONTENTS',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'IP_NO',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_FILE_PATH1',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_FILE_PATH2',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_FILE_PATH3',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_FILE_PATH4',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_FILE_PATH5',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['writeBoard'] = {
  name: currentName,
  returnName: 'WRITEBOARD',
};

currentName = 'SP_COIN_ADDR_CREATE';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'CURR',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'BOWNER',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'B_CODE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'ADDR',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'PASS',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'MEMO',
      type: sql.Text,
      required: true,
    },
    {
      name: 'PATH',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'FILENAME',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['createAddr'] = {
  name: currentName,
  returnName: 'CREATEADDR',
};

currentName = 'SP_MY_COIN_BALANCE';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['getCoinBalance'] = {
  name: currentName,
  returnName: 'GETCOINBALANCE',
};

currentName = 'SP_MAIL_NCHECK';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_COUNTRY_CODE',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_EMAIL',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_FLAG',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_SESSION',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'D_IP',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['sendSMS'] = {
  name: currentName,
  returnName: 'SENDSMS',
};

currentName = 'SP_MY_SELLKEY_IMG';
currentInfo = {
  usingCache: false,
  params: [
    {
      name: 'D_UID',
      type: sql.NVarChar(100),
      required: true,
    },
    {
      name: 'SELLKEY',
      type: sql.NVarChar(100),
      required: true,
    },
  ],
};
procedureInfo.setProcedureInfo(currentName, currentInfo);
procedureNames['getSellImg'] = {
  name: currentName,
  returnName: 'SELLIMG',
};

exports.procedureInfo = procedureInfo;
exports.procedureNames = procedureNames;
