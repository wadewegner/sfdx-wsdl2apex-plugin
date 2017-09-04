const path = require('path');
const os = require('os');
const helper = require('../lib/helper.js');
const fse = require('fs-extra');

(function () {
  'use strict';

  module.exports = {
    topic: 'apex',
    command: 'wsdl:convert',
    description: 'convert wsdl to apex',
    help: 'help text for waw:apex:wsdl:convert',
    flags: [
      {
        name: 'pathtowsdl',
        char: 'p',
        description: 'path to WSDL file',
        hasValue: true,
        required: true
      }, {
        name: 'outputdir',
        char: 'd',
        description: 'folder for saving the created files',
        hasValue: true,
        required: true
      }
    ],
    run(context) {

      const pathToWsdl = context.flags.pathtowsdl;
      const outputdir = context.flags.outputdir;

      fse.ensureDirSync(outputdir);

      const apexWsdlPath = path.dirname(require.resolve('sfdx-wsdl2apex-plugin'));
      const jarPath = path.join(apexWsdlPath, 'resources', 'WSDL2Apex-1.0.jar');

      const script = `java -jar ${jarPath} ${pathToWsdl} ${outputdir} no`;
      console.log(script);

      helper.run(script, (commandResult, commandErr) => {

        console.log(commandResult);

      });
    }
  };
}());