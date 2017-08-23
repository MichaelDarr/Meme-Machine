var Agenda          = require('agenda')
  , helpers         = require('./helpers')
  , app             = require('./index')
  , rp              = require('request-promise')
  , markov          = require('markov');

var conf = helpers.getConfig();

var agenda = new Agenda({db: {address: conf.mongo.uri}});

agenda.maxConcurrency(100);
agenda.defaultConcurrency(100);

agenda.define('import members', function(job, done) {
    var User = require("./models/user").User;

    var p_getGroup = rp({ method    : 'GET'
                        , uri       : 'https://api.groupme.com/v3/groups/' + conf.bot.group_id
                        , qs        : { token: conf.groupme.token }
                        , json      : true
                    });

    var p_saveUsers = p_getGroup.then(group => {
        var members = group.response.members
        return Promise.map(members, member => {
            return User.findOneAndUpdate({ user_id: member.user_id }, member, { upsert: true}).exec();
        })
    })

    p_saveUsers.then(users => {
        agenda.now('import messages');
        done()
    })
})

agenda.define('import messages', function(job, done) {
    var Message = require("./models/message").Message;

    var before_id = job.attrs.data;

    if(before_id) {
        var p_getGroup = rp({ method    : 'GET'
                            , uri       : 'https://api.groupme.com/v3/groups/' + conf.bot.group_id + '/messages'
                            , qs        : { token       : conf.groupme.token
                                          , before_id
                                          }
                            , json      : true
                            })
    }
    else {
        var p_getGroup = rp({ method    : 'GET'
                            , uri       : 'https://api.groupme.com/v3/groups/' + conf.bot.group_id + '/messages'
                            , qs        : { token: conf.groupme.token }
                            , json      : true
                            })
    }

    var p_saveMessages = p_getGroup.then(messages => {
        var messages = messages.response.messages
        if(messages.length === 20) {
            agenda.now('import messages', messages[19].id)
        }
        return Promise.map(messages, message => {
            if(message.system || message.event) return null
            return Message.findOneAndUpdate({ id: message.id }, message, { upsert: true }).exec();
        })
    })

    p_saveMessages.then(messages => {
        done();
    })
})

agenda.define('import single message', function(job, done) {
    var Message = require("./models/message").Message;

    var message = job.attrs.data;

    var p_saveMessage = Message.findOneAndUpdate({ id: message.id }, message, { upsert: true }).exec();

    p_saveMessages.then(done());
})

agenda.define('send message', function(job, done) {
    var text = job.attrs.data;

    var p_sendMessage = rp({ method     : 'POST'
                           , uri        : 'https://api.groupme.com/v3/bots/post'
                           , body       : { bot_id  : conf.bot.id
                                          , text
                                          }
                           , json       : true
                           });

    p_sendMessage.then(message => {
        done();
    })
})

agenda.define('generate markov message', function(job, done) {
    var Message = require("./models/message").Message;

    var m = markov(6);

    var sender_id = job.attrs.data;

    var p_getText = Message.find({ sender_id }).select('text')

    var p_seedMarkov = p_getText.then(records => {
        var finalString = '';
        records.forEach(record => {
            if(record.text) {
                var text = record.text;
                var lastChar = text[text.length -1];
                if(text.charAt(0) != '*' && text != 'Imitate' && text != 'immitate') {
                    if(!(['.', '!', '?'].indexOf(lastChar) > -1)) text = text + '.';
                    finalString = finalString.concat(' ' + record.text)
                }
            }
        })
        return new Promise(function(resolve, reject) {
            m.seed(finalString, function() {
                resolve();
            })
        })
    })

    p_seedMarkov.then(markov => {
        while(true) {
            var key = m.pick()
            var message = m.fill(key, 100).join(' ')
            var sentenceArr = message.match(/(.*?(?:\.|\?|!))(?: |$)/g)
            sentenceArr = sentenceArr.slice(1, sentenceArr.length)
            var buffer = ''
            var finalArr = []
            var conCount = 0
            sentenceArr.forEach(sentence => {
                if(sentence.length < conf.messages.maxLength) {
                    if(buffer.length + sentence.length + 1 < conf.messages.maxLength) {
                        if(Math.random > .75 && conCount < 2) {
                            buffer = buffer + ' ' + sentence
                            conCount++;
                        }
                        else {
                            if(buffer != '' && buffer.length > 20) {
                                finalArr.push(buffer)
                            }
                            buffer = sentence
                        }
                    }
                    else {
                        if(buffer.length > 20) {
                            finalArr.push(buffer);
                            buffer = sentence
                        }
                    }
                }
            })
            if(finalArr.length > 0) {
                var message = finalArr[Math.floor(Math.random()*finalArr.length)];
                agenda.now('send message', message)
                done();
                break;
            }
        }
    })
})

agenda.on('ready', function() {
    agenda.now('import members')
    agenda.start();
})

module.exports = agenda;
