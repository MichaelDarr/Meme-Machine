var Agenda          = require('agenda')
  , helpers         = require('./helpers')
  , app             = require('./index')
  , rp              = require('request-promise')

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
        var members = group.response.members;
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
            if(message.system) return null
            message.event_type = message.event ? message.event.type : null;
            return Message.findOneAndUpdate({ id: message.id }, message, { upsert: true }).exec();
        })
    })

    p_saveMessages.then(messages => {
        done();
    })
})

agenda.on('ready', function() {
    agenda.now('import members')
    agenda.start();
})

module.exports = agenda;
