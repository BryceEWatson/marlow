// Polyfill to support native ES6 promises
window.Promise = window.Promise || require('native-promise-only');

var App = require('./App');

var app = new App({
    name: null,
    welcomeMsg: null
});

module.exports = window.app = app;

window.addEventListener('load', function load(event){
    window.removeEventListener('load', load);
    //Optional: Call initial app actions on page load.
    //Ex. app.getInitialData();
});

