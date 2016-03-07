var template = require('./template.marko');
var AppState = require('src/app/AppState');

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    template.render({
            stateProvider: function stateProvider(callback) {
                //Optional: Add server-side service calls on initial page load.
                var appState = new AppState({
                    name: 'World!'
                });

                callback(null, appState);
            }
        },
        res);
};