const {
    exec
  } = require('child_process');
  
  module.exports = {
    run: (commandScript, commandResult) => {

      exec(commandScript, (err, stdout, stderr) => {
        if (stderr && err) {
  
            //console.log(`run:err`, err);
            //console.log(`run:stderr`, stderr);
  
            commandResult(null, stderr.replace(/\r?\n|\r/, '').trim());
            return;
        }
        
        commandResult(stdout.replace(/\r?\n|\r/, '').trim(), null);
      });
    }
  };