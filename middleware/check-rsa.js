const logger = require('../lib/logger');
const cryptico = require('cryptico');
module.exports = checkRSAKey = (req, res, next) => {
  if (req.session.rsakey == undefined || req.session.publickey == undefined) {
    logger.info('Create a key attempt : ' + req.sessionID);
    const PassPhrase = req.sessionID;
    const Bits = 512;
    const RSAKey = cryptico.generateRSAKey(PassPhrase, Bits);
    const publicKeyString = cryptico.publicKeyString(RSAKey);
    req.session.rsakey = JSON.stringify(RSAKey.toJSON());
    req.session.publickey = publicKeyString;
  }

  next();
};
