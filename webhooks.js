module.exports = function(app, helpers, agenda) {

    app.post('/groupme', function(req, res) {
        agenda.now('import single message', req.body)
        if(req.body.sender_type != "bot") {
            if(req.body.text.indexOf('Imitate') > -1) {
                var markov = 4
                if(req.body.text.indexOf('good') > -1) markov = 6
                else if(req.body.text.indexOf('really good') > -1) markov = 8
                else if(req.body.text.indexOf('bad') > -1) markov = 2
                else if(req.body.text.indexOf('really bad') > -1) markov = 1
                agenda.now('generate markov message', {markov, sender_id: req.body.sender_id});
            }
            else if(req.body.sender_id === '19747855') {
                if(Math.random() > .075) {
                    agenda.now('send message', 'Stop shitposting, Connor');
                }
            }
        }
    })

};
