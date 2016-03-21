// Delete Files

var glob = require("glob");
var fs = require("fs");

// Find files
glob("**/*.marko.js",function(err,files){
     if (err) throw err;
     // Delete files
     files.forEach(function(item,index,array){
          fs.unlink(item, function(err){
               if (err) throw err;
          });
     });
     console.log(" ------ ");
     console.log(files.length + " files cleaned up!\n");
});
