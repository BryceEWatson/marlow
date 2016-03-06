var express = require("express");
var app = module.exports = express();
var findPort = require('find-open-port');
var log = require('npmlog');
log.enableColor();

function index(req,res){
  res.send('Hello World!');
}

module.exports = {
    start: function(callback) {
        findPort().then(port => {
            app.listen(port);
            app.get('/', index);
            log.info('', 'Listening on port '+port);
            callback(port);
        });
    },
    stop: function() {
        //TODO: stop server.
    }
};