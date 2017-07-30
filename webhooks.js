module.exports = function(app, helpers, agenda) {

    app.post('/groupme', function(req, res) {
        if(req.body.sender_type != "bot") {
            agenda.now('send message', 'shut up guys im trying to think');
        }
    })

};
