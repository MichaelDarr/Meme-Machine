var Config  = require('./config')
  , rp      = require('request-promise')

var conf = new Config();

function getConfig() {
    return conf;
}

exports.getConfig = getConfig;
