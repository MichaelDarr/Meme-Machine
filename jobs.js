var Agenda          = require('agenda')
  , helpers         = require('./helpers')
  , app             = require('./index')
  , requestPromise  = require('request-promise')

var conf = helpers.getConfig();

var agenda = new Agenda({db: {address: conf.mongo.uri}});

agenda.maxConcurrency(100);
agenda.defaultConcurrency(100);

agenda.on('ready', function() {
    agenda.start();
})

module.exports = agenda;
