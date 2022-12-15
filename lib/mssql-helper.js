'use strict';
require('../env');
var sql = require('mssql');
var allProcedureInfo = require('./procedure-info').procedureInfo;
var commonLib = require('./commonLib');
var NodeCache = require('node-cache');
var ignoreCase = require('ignore-case');
var myCache = new NodeCache();
var logger = require('./logger');
var pool = null;

const env = process.env;
var _options = {
  CACHE_TTL: 1,
};

const config = {
  user: env.MSSQL_USER,
  password: env.MSSQL_PASSWORD,
  server: env.MSSQL_SERVER,
  port: Number(env.MSSQL_PORT),
  database: env.MSSQL_DATABASE,
  options: {
    encrypt: false,
  },
};

init();

async function init() {
  try {
    pool = await sql.connect(config);
  } catch (err) {
    logger.error('create connection pool failed.. : ' + err);
  }
}

var callProcedure = async function (procedureName, params) {
  logger.info('callProcedureSync start - ' + procedureName);
  var timer = commonLib.timer.prototype;
  timer.start();
  var procedureInfo = allProcedureInfo.getProcedureInfo(procedureName);
  var cacheKey = '';
  var returnData = null;
  var request = null;

  //get procedureInfo
  if (commonLib.isNull(procedureInfo)) {
    logger.error('Failed to find procedure information');
    return null;
  }
  //check parameters
  if (!paramsCheck(procedureInfo, params)) {
    return null;
  }
  //check using cache
  if (procedureInfo.usingCache) {
    cacheKey = getCacheKey(procedureName, procedureInfo, params);

    logger.info('cacheKey : ' + cacheKey);

    returnData = myCache.get(cacheKey);
    if (returnData != undefined) {
      logger.info(procedureName + ' has cache');
      return returnData;
    }
  }

  //get request
  request = await getRequest();

  if (request == null) {
    return null;
  }
  request = settingRequestParams(request, procedureInfo, params);
  returnData = await executeProcedure(request, procedureName);

  if (returnData == null) {
    logger.error('callProcedureSync failed');
    return null;
  }

  myCache.set(cacheKey, returnData, _options.CACHE_TTL);
  logger.info('during time : ' + timer.end());
  logger.info(procedureName + ' callProcedureSync success');
  return returnData;
};

async function getRequest() {
  try {
    //var pool = await sql.connect(config);
    var request = await pool.request();
    return request;
  } catch (err) {
    logger.error('getRequest failed : ' + err);
    return null;
  }
}

function getCacheKey(procedureName, procedureInfo, params) {
  var cacheKey = procedureName + '_';
  var defiendParams = procedureInfo.params;
  var paramName = '';
  var paramValue = '';

  for (var i = 0; i < defiendParams.length; i++) {
    paramName = defiendParams[i].name;
    if (commonLib.isNull(params[paramName])) {
      paramValue = '';
    } else {
      paramValue = params[paramName];
    }
    cacheKey += paramName + '=' + paramValue;
  }
  return cacheKey;
}

function paramsCheck(procedureInfo, params) {
  var defiendParams = procedureInfo.params;
  var paramInfo = null;
  var paramName = '';
  var paramType = '';
  var required = false;
  var paramValue = '';
  for (var i = 0; i < defiendParams.length; i++) {
    paramInfo = defiendParams[i];
    paramName = paramInfo.name;
    paramType = paramInfo.type;
    required = paramInfo.required;

    paramValue = params[paramName];
    logger.info('NAME : ' + paramName + ', VALUE : ' + paramValue);
    if (commonLib.isNull(paramValue)) {
      if (required) {
        logger.error('paramsCheck failed');
        return false;
      }
    }
  }
  return true;
}

function settingRequestParams(request, procedureInfo, params) {
  var defiendParams = procedureInfo.params;
  var paramInfo = null;
  var paramName = '';
  var paramType = '';
  var required = false;
  var paramValue = '';

  for (var i = 0; i < defiendParams.length; i++) {
    paramInfo = defiendParams[i];
    paramName = paramInfo.name;
    paramType = paramInfo.type;
    required = paramInfo.required;

    paramValue = params[paramName];
    if (commonLib.isNull(paramValue)) {
      if (required) {
        logger.error('settingRequestParams failed');
        return null;
      } else {
        paramValue = '';
      }
    }
    request.input(paramName, paramType, paramValue);
  }
  return request;
}

async function executeProcedure(request, procedureName) {
  try {
    var returnData = await request.execute(procedureName);
    return returnData;
  } catch (err) {
    logger.error('executeProcedure failed : ' + err);
    return null;
  }
}

exports.callProcedure = callProcedure;
