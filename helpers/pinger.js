var http = require('http'); //importing http

function startKeepAlive() {
    setInterval(function() {
        var options = {
            host: 'work-rules.herokuapp.com',
            port: 80,
            path: '/api'
        };
        http.get(options, function(res) {
            res.on('data', function(chunk) {
                try {
                    // optional logging... disable after it's working
                    console.log("HEROKU RESPONSE: ");
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Error: " + err.message);
        });
    }, 10 * 60 * 1000); // load every 20 minutes
}

module.exports = startKeepAlive