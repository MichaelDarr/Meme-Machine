var express     = require('express')
  , Promise     = require('bluebird')
  , mongoose    = require('mongoose')
  , bodyParser  = require('body-parser')
  , agendash    = require('agendash')
  , agenda      = require('./jobs')
  , helpers     = require('./helpers')

var conf = helpers.getConfig();

var app = module.exports = express();

app.use(bodyParser.json())
app.use('/dash', agendash(agenda));

global.Promise = Promise;
mongoose.Promise = Promise;

mongoose.connect(conf.mongo.uri, { useMongoClient: true })

require('./webhooks')(app, helpers, agenda)

app.listen(80, function () {
  console.log('Meme Machine is listening to you')
})
