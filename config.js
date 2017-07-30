var _ = require('lodash');

module.exports = function() {
    let defaults = {
        mongo: { uri: 'mongodb://localhost/mm' }
    }

    // Starting command for switching environments:
    // set NODE_ENV=test&&node index
    switch(process.env.NODE_ENV.trim()) {
        case "production":
        return _.merge(defaults, {

        });

        case "test":
        return _.merge(defaults, {

        });
    }
    return defaults;
};
