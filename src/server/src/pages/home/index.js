var template = require('./template.marko');
var AppState = require('../../app/AppState');

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    template.render({
            stateProvider: function stateProvider(callback) {
                //Optional: Add server-side service calls on initial page load.
                require('src/server/src/services/tools/handlers.js').startup({}, function(status, data) {
                    callback(null, data);
                });
            }
        },
        res);
};