var colors = require('colors/safe');
var commands = require('src/commands/commands.js');
var open = require('open');
var process = require('process');

module.exports = {
    startup: function(args, callback) {
        var currentDir = require('process').cwd()
        callback(null, {
            currentDir: currentDir
        });
    },
    downloadSampleProject: function(args, callback) {
        try {
            commands.execute(commands.cloneAndInstall(args), function (res) {
                var status = res.success ? 'Success' : 'Failed';
                console.log(colors.green(status+': Clone and install with code ' + res.code));
                if (res.success && args.start) {
                    commands.execute(commands.cd(args.generate) + ' && ' + commands.npmStart + ' &', function (res) {
                        setTimeout(function() {
                            open('http://localhost:' + 8080);
                        }, 3000);
                    });
                }
            });
        }catch(e) {
            console.log('Error in toolsService.downloadSampleProject ' + e);
        }
    }
};
