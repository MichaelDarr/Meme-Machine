var _       = require('lodash')

module.exports = function() {
  let defaults =
    { mongo   : { uri: 'mongodb://localhost/mm' }
    , groupme : { token: 'a1d85a80451301360f3975223b1b6165' }
    , messages: { maxLength : 200 }
    , import  : false
    }

    if(process.env.IMPORT) {
      _.merge(defaults, { import: true })
    }
  // Starting command for switching environments:
  // set NODE_ENV=test&&node index
  switch(process.env.NODE_ENV.trim()) {
    case "production":
      return _.merge(defaults,
        { bot : { id      : 'cb57035b30e15dc70955d35ad4'
                , group_id: '37151355'
                }
        , port: 8080
        }
      )
    case "test":
      return _.merge(defaults,
        { bot : { id      : '7a2cb91f3bc8c562add204aec3'
                , group_id: '32647687'
                }
        , port: 80
        }
      )
  }

  return defaults;
};
