var _ = require('lodash');

module.exports = function() {
    let defaults = { mongo: { uri: 'mongodb://localhost/mm' } }

    // Starting command for switching environments:
    // set NODE_ENV=test&&node index
    switch(process.env.NODE_ENV.trim()) {
        case "production":
        return _.merge(defaults, { bot: { id        : 'e48f8cb9768dca41aca063c877'
                                        , group_id  : '28981508'
                                        }
                                 });

        case "test":
        return _.merge(defaults, { bot: { id        : '7a2cb91f3bc8c562add204aec3'
                                        , group_id  : '32647687'
                                        }
                                 });
    }
    return defaults;
};
