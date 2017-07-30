var Config = require('./config')

var conf = new Config();

function getConfig() {
    return conf;
}

exports.getConfig = getConfig;
