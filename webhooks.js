module.exports = function(app, helpers) {

    app.post('/groupme', function(req, res) {
        console.log(req.body)
    })

};
