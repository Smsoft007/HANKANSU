require('../env');
const env = process.env;
const commonLib = require('./commonLib');
const Web3 = require('web3');
const logger = require('./logger');
const resolve = require('path');
const appRoot = require('app-root-path');
const keythereum = require('keythereum-pure-js');
const bitcoin = require('bitcoin');
const Tx = require('ethereumjs-tx').Transaction;
const apiOptions = {
  verbose: 1,
  raw: 1,
  timeout: 15000, //5초
};
const btc_option = {
  host: env.BTC_HOST,
  port: env.BTC_PORT,
  user: env.BTC_USER,
  pass: env.BTC_PASS,
  timeout: 1000 * 15,
};

const lit_option = {
  host: env.LIT_HOST,
  port: env.LIT_PORT,
  user: env.LIT_USER,
  pass: env.LIT_PASS,
  timeout: 1000 * 15,
};

const gtac_option = {
  host: env.GTAC_HOST,
  port: env.GTAC_PORT,
  user: env.GTAC_USER,
  pass: env.GTAC_PASS,
  timeout: 1000 * 15,
};

const tk_option = {
  host: env.TK_HOST,
  port: env.TK_PORT,
  user: env.TK_USER,
  pass: env.TK_PASS,
  timeout: 1000 * 15,
};

let web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    'wss://ropsten.infura.io/ws/v3/ba91a3456e6a47ef92414fbbc23a444b'
    // "wss://mainnet.infura.io/ws/v3/ba91a3456e6a47ef92414fbbc23a444b"
  )
);

exports.checkAddress = async (type, addr) => {
  if (type === 'ETH') {
    return await web3.utils.isAddress(addr);
  } else {
    try {
      console.log(addr);
      const client = await getCoinClient(type);
      const rpcData = await isBTCAddr(client, addr);
      return rpcData.isvalid;
    } catch (error) {
      return false;
    }
  }
};

exports.getEthBalance = async (addr) => {
  const getBalanceUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${addr}&tag=latest&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94`;
  const r = await commonLib.callApi(getBalanceUrl, apiOptions, false);
  if (r.status === '1') {
    return web3.utils.fromWei(r.result);
  }
  return null;
};

exports.sendEth = async (to, from, balance, ethPass) => {
  logger.info('start sendRawTransacstion');
  const keyObject = keythereum.importFromFile(from, appRoot.path);
  const privateKey = Buffer.from(
    keythereum.recover(ethPass, keyObject).toString('hex'),
    'hex'
  );

  const gasVal = '100';
  const gasUrl =
    'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=K2FEEGIVRR9JT4RRQSI664JQMHKJJCXQ94';
  const r = await commonLib.callApi(gasUrl, apiOptions, false);

  if (r.status == '1') {
    gasVal = r.result.ProposeGasPrice;
  }

  const gasPrice = web3.utils.toWei(gasVal, 'gwei');
  //balance - (gasPrice * 21000) 전부 보내기

  const txData = {
    gasLimit: web3.utils.toHex(21000),
    gasPrice: web3.utils.toHex(gasPrice), // 10 Gwei
    to: to,
    from: from,
    value: web3.utils.toHex(web3.utils.toWei(balance) - 6e9 * 21000),
  };

  const txCount = await web3.eth.getTransactionCount(from);
  const newNonce = web3.utils.toHex(txCount);
  const transaction = new Tx(
    {
      ...txData,
      nonce: newNonce,
    },
    {
      // chain: "mainnet",
      chain: 'ropsten',
    }
  ); // or 'rinkeby'
  transaction.sign(privateKey);
  const serializedTx = transaction.serialize().toString('hex');
  return web3.eth.sendSignedTransaction('0x' + serializedTx);
};

exports.createEthAddress = (pass) => {
  logger.info('create ethereum address');
  const dk = keythereum.create({
    keyBytes: 32,
    ivBytes: 16,
  });

  const keyObject = keythereum.dump(pass, dk.privateKey, dk.salt, dk.iv, {
    kdf: 'pbkdf2',
    cipher: 'aes-128-ctr',
    kdfparams: {
      c: 262144,
      dklen: 32,
      prf: 'hmac-sha256',
    },
  });
  keythereum.exportToFile(keyObject, appRoot.path + '/keystore');
  logger.info(`create eth key is 0x${keyObject.address}`);
  logger.info(`create eth pass is ${pass}`);
  return '0x' + keyObject.address;
};

function getCoinClient(clientName) {
  logger.info('getCoinClient - ' + clientName);
  let client;
  try {
    if (clientName == 'BTC') {
      client = new bitcoin.Client(btc_option);
    } else if (clientName == 'LTC') {
      client = new bitcoin.Client(lit_option);
    } else if (clientName == 'GTAC') {
      client = new bitcoin.Client(gtac_option);
    } else if (clientName == 'TK') {
      client = new bitcoin.Client(tk_option);
    }
  } catch (err) {
    logger.info('getCoinClient failed - ' + clientName + 'err : ' + err);
  }
  if (commonLib.isNull(client)) {
    return null;
  }
  logger.info('success ' + clientName + ' getCoinClient');
  return client;
}

exports.coinNoti = async (type, txid) => {
  logger.info(`${type} coin Notification!!`);
  const returnData = {};
  let client;
  let txinfo;
  try {
    client = await getCoinClient(type);

    logger.info('Get transcation info');
    txinfo = await getTransaction(client, txid);
    logger.info(`Txdata is ${txinfo}`);
    // TXINFO: {
    //   amount: 0,
    //   fee: 0,
    //   confirmations: 0,
    //   txid: '497846a70bdd07ffe7186fcac0f5b56acf9d233bc8b29039f0c507673518d15b',
    //   normtxid: '68009c10522d41e0fa51bed44ce5039bfd08bc8aa576da63e2ae4a621420dea2',
    //   time: 1640266796,
    //   timereceived: 1640266796,
    //   details: [
    //     {
    //       account: '',
    //       address: 'TYJri7jtv4CDjVVWDj8BpgC7efoqcfeVVZ',
    //       category: 'send',
    //       amount: -0.001,
    //       fee: 0
    //     },
    //     {
    //       account: 'myaccount',
    //       address: 'TYJri7jtv4CDjVVWDj8BpgC7efoqcfeVVZ',
    //       category: 'receive',
    //       amount: 0.001
    //     }
    //   ]
    // }

    returnData['txid'] = txid;
    returnData['fee'] = txinfo['details'][0]['fee'];

    return returnData;
  } catch (error) {
    logger.error('DoTransaction Error is ' + error);
    return null;
  }
};

exports.doTransaction = async (type, target, amount) => {
  logger.info('Start Transaction');
  const returnData = {};
  let client;
  let balance;
  let txid;
  let txinfo;
  try {
    client = await getCoinClient(type);

    logger.info(`Get ${type} Balance`);

    balance = await getBTCBalance(client, '*');

    if (balance < amount * 1) {
      logger.info(`Not enough ${type} Core balance`);
      return;
    }

    logger.info('SendToAddress start');
    txid = await sendToAddress(client, target, amount);

    logger.info('Get transcation info');
    txinfo = await getTransaction(client, txid);
    logger.info(`Txdata is ${txinfo}`);

    returnData['txid'] = txid;
    returnData['fee'] = txinfo['details'][0]['fee'];

    return returnData;
  } catch (error) {
    logger.error('DoTransaction Error is ' + error);
    return null;
  }
};
//TODO 나중에 시간나면 바꿔보자
function getTransaction(client, txid) {
  const promise = new Promise((resolve, reject) => {
    client.getTransaction(txid, function (err, txinfo, resHeaders) {
      if (err) {
        reject(err);
        return;
      }
      resolve(txinfo);
    });
  });
  return promise;
}

//TODO 나중에 시간나면 바꿔보자
function sendToAddress(client, target, amount) {
  const promise = new Promise((resolve, reject) => {
    client.sendToAddress(target, amount * 1, function (err, txid, resHeaders) {
      if (err) {
        reject(err);
        return;
      }
      resolve(txid);
    });
  });
  return promise;
}

//TODO 나중에 시간나면 바꿔보자
function getBTCBalance(client, addr) {
  const promise = new Promise((resolve, reject) => {
    client.getBalance(addr, function (err, balance, resHeaders) {
      if (err) {
        reject(err);
        return;
      }
      resolve(balance);
    });
  });
  return promise;
}

function isBTCAddr(client, addr) {
  const promise = new Promise((resolve, reject) => {
    client.validateAddress(addr, function (err, isAddr, resHeaders) {
      if (err) {
        reject(err);
        return;
      }
      resolve(isAddr);
    });
  });
  return promise;
}

function getABTCAddress(client) {
  const promise = new Promise((resolve, reject) => {
    client.cmd('getnewaddress', 'myaccount', function (err, addr, resHeaders) {
      if (err) {
        reject(err);
        return;
      }
      resolve(addr);
    });
  });

  return promise;
}

exports.createCoinAddress = async function (type) {
  logger.info('createCoinAddress start');

  let data = null;

  const client = await getCoinClient(type);

  if (!client) {
    logger.error(type + 'Client is Null');
    return;
  }

  try {
    data = await getABTCAddress(client);
  } catch (err) {
    logger.error(type + ' createCoinAddress failed : ' + err);
    return;
  }

  if (!data) {
    logger.error(type + 'Address is Null');
    return;
  }

  return data;
};
