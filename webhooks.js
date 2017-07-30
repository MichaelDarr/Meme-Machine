module.exports = function(app, helpers, agenda) {

    app.post('/groupme', function(req, res) {
        if(req.body.sender_type != "bot") {
            if(req.body.text.indexOf('Imitate') > -1) {
                agenda.now('generate markov message', req.body.sender_id);
            }
            else if(req.body.sender_id === '19747855') {
                agenda.now('send message', 'Stop shitposting, Connor');
            }
        }
    })

};
