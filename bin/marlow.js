#!/usr/bin/env node
/*jslint node: true */

var colors = require('colors/safe');
var commands = require('../src/commands/commands.js');
var config = require('../src/util/config');
var open = require('open');
var path = require('path');
var process = require('process');
var shelljs = require('shelljs/global');

var filename = path.basename(__filename);

var ACCEPTED_USER_CMDS = [ 'generate'];
var START_OPTIONS = ['-s', '--start'];

if (!which('git')) {
    log.error(filename+'This package requires git');
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
            description: 'Generate a new starter project'
        },
        '--start -s': {
            type: 'boolean',
            description: 'Start the server after generate'
        }
    })
    .usage('Usage: $0 [options]')
    .example('Open the tools web menu (opens a web browser window)', '$0')
    .example('Generate a new project my-project. Optionally start the server when finished',
        '$0 --generate my-project --start')
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
        //start web interface
        commands.execute(commands.cd(path.join(__dirname, '../src/server')) + ' && ' + commands.npmInstall + ' && ' + commands.npmStart);
    } else if (options.generate) {
        //generate from base project
        commands.execute(commands.cloneAndInstall(options), function (res) {
            var status = res.success ? 'Success' : 'Failed';
            console.log(colors.green(status+': Clone and install with code ' + res.code));
            if (res.success && options.start) {
                commands.execute(commands.cd(options.generate) + ' && ' + commands.npmStart + ' &', function (res) {
                    setTimeout(function() {
                        open('http://localhost:' + 8080);
                    }, 3000);
                });
            }
        });
    }
}

marlow(options);
