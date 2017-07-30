module.exports = function(app, helpers, agenda) {

    app.post('/groupme', function(req, res) {
        if(req.body.sender_type != "bot" && req.body.text.indexOf('immitate') > -1) {
            agenda.now('generate markov message', req.body.sender_id);
            //agenda.now('send message', 'shut up guys im trying to think');
        }
    })

};
