var mongoose = require("mongoose");

var schemaObj =
  { user_id:
    { type  : Number
    , index : true
    }
  , nickname  : String
  , image_url : String
  , id        : Number
  , muted     : Boolean
  , autokicked: Boolean
  }

var UserSchema = new mongoose.Schema(schemaObj);

var User = mongoose.model('User', UserSchema);

module.exports = { User }
