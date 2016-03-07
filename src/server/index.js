require('app-module-path').addPath(__dirname);
require('marko/node-require').install();
require('lasso/node-require-no-op').enable('.less', '.css');

var express = require('express');
var findPort = require('find-open-port');
var compression = require('compression'); // Provides gzip compression for the HTTP response
var serveStatic = require('serve-static');
var open = require('open');

// If the process was started using browser-refresh then enable
// hot reloading for certain types of files to short-circuit
// a full process restart. You *should* use browser-refresh
// in development: https://www.npmjs.com/package/browser-refresh
require('marko/browser-refresh').enable();
require('lasso/browser-refresh').enable('*.marko *.css *.less');

var isProduction = process.env.NODE_ENV === 'production';

// Configure the RaptorJS Optimizer to control how JS/CSS/etc. is
// delivered to the browser
require('lasso').configure({
    plugins: [
        'lasso-less', // Allow Less files to be rendered to CSS
        'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
    ],
    outputDir: __dirname + '/static', // Place all generated JS/CSS/etc. files into the "static" dir
    bundlingEnabled: isProduction, // Only enable bundling in production
    minify: isProduction, // Only minify JS and CSS code in production
    fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
    bundles: [ // Create a separate JavaScript bundle for jQuery
        {
            name: 'jquery',
            dependencies: [
                'require: jquery' // Put only the jquery module in this bundle
            ]
        }
    ]
});

var app = express();

// Enable gzip compression for all HTTP responses
app.use(compression());

// Allow all of the generated files under "static" to be served up by Express
app.use('/static', serveStatic(__dirname + '/static'));


require('./routes').addRoutes(app);
require('./src/services/hello').addRoutes(app);

app.use(require('./src/pages/error'));

findPort().then(port => {
    app.listen(port, function() {
        console.log('Listening on port %d', port);
        open('http://localhost:' + port);
        // The browser-refresh module uses this event to know that the
        // process is ready to serve traffic after the restart
        if (process.send) {
            process.send('online');
        }
    });
});
