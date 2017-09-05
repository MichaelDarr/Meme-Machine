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

app.use(function(req, res, next) {
    //useless middleware, for future security use
    next();
});

global.Promise = Promise;
mongoose.Promise = Promise;

mongoose.connect(conf.mongo.uri, { useMongoClient: true })

require('./webhooks')(app, helpers, agenda)

app.listen(conf.port, function () {
  console.log('Meme Machine is listening to you')
})
