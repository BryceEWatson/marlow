#!/usr/bin/env node
/*jslint node: true */

var commands = require('../commands/commands.js');
var config = require('../util/config');
var server = require('../server/server.js');
var shelljs = require('shelljs/global');
var open = require('open');
var process = require('process');
var log = require('npmlog');
log.enableColor();
var path = require('path');
var filename = path.basename(__filename);

var ACCEPTED_USER_CMDS = [ 'generate'];
var START_OPTIONS = ['-s', '--start'];

if (!which('git')) {
    log.error(filename, 'This package requires git');
    exit(1);
}

/*
* Use cases:
* `marlow`: starts server, opens web menu in browser
* `marlow --generate todomvc-marko`: clone + install the todomvc-marko project
*/

var options = require('argly')
    .createParser({
        '--help': {
            type: 'boolean',
            description: 'Show this help message'
        },
        '--generate -g': {
            type: 'string',
            description: 'Generate a sample project'
        },
        '--start -s': {
            type: 'boolean',
            description: 'Start the server after generate'
        }
    })
    .usage('Usage: $0 [options]')
    .example('Open the tools web menu (opens a web browser window)', '$0')
    .example('See a list of project templates to generate from', '$0 --generate')
    .example('Generate the todomvc-marko project. Optionally start the server when finished',
        '$0 --generate todomvc-marko --start')
    .validate(function (result) {
        if (result.help) {
            this.printUsage();
            process.exit(0);
        }
    })
    .onError(function (err) {
        this.printUsage();
        console.error(err);
        process.exit(1);
    })
    .parse();

function marlow(options) {
    if (!options || !options.generate) {
        server.start(function (port) {
            open('http://localhost:' + port);
        });
    } else if (options.generate) {
        commands.execute(commands.cloneAndInstall(options.generate), function (res) {
            var status = res.success ? 'Success' : 'Failed';
            log.info(status, 'Clone and install with code ' + res.code);
            if (res.success && options.start) {
                commands.execute(commands.cd(options.generate) + ' && ' + commands.npmStart + ' &', function (res) {
                    //TODO: Find a better way to do this!
                    setTimeout(function() {
                        open('http://localhost:' + 8080);
                    }, 3000);
                });
            }
        });
    }
}

marlow(options);
