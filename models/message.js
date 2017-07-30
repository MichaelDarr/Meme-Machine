var mongoose = require("mongoose");

var schemaObj = { attachments   : [ { type    : String
                                    , url     : String
                                    }
                                  ]
                , avatar_url    : String
                , created_at    : Number
                , favorited_by  : [Number]
                , group_id      : Number
                , id            : Number
                , name          : String
                , sender_id     : Number
                , sender_type   : String
                , source_guid   : String
                , text          : String
                , user_id       : Number
                }
// { typeKey: '$type' } is necessary because mongoose will interpret the "type" in attachements incorrectly
var MessageSchema = new mongoose.Schema(schemaObj, { typeKey: '$type' });

var Message = mongoose.model('Message', MessageSchema);

module.exports = { Message }
