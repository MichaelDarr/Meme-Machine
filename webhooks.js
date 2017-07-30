module.exports = function(app, helpers, agenda) {

    app.post('/groupme', function(req, res) {
        console.log(req.body)
    })

};
