const path = require('path');
const os = require('os');
const helper = require('../lib/helper.js');
const fse = require('fs-extra');
const watch = require('node-watch');
const fs = require('fs');

(function () {
  'use strict';

  module.exports = {
    topic: 'apex',
    command: 'wsdl:convert',
    description: 'convert wsdl to apex',
    help: 'help text for waw:apex:wsdl:convert',
    flags: [{
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
    }, {
      name: 'async',
      char: 'a',
      description: 'make it an async class',
      hasValue: false,
      required: false
    }],
    run(context) {

      const pathToWsdl = context.flags.pathtowsdl;
      const outputdir = context.flags.outputdir;
      let asyncFlag = context.flags.async;
      let async = 'yes';

      if (asyncFlag === undefined || asyncFlag === null) {
        async = 'no';
      }

      fse.ensureDirSync(outputdir);

      const apexWsdlPath = path.dirname(require.resolve('sfdx-wsdl2apex-plugin'));
      const jarPath = path.join(apexWsdlPath, 'resources', 'WSDL2Apex-1.0.jar');
      const script = `java -jar ${jarPath} ${pathToWsdl} ${outputdir} ${async}`;
      
      watch(outputdir, {
        recursive: true
      }, function (evt, name) {

        const fileName = path.basename(name, '.cls');

        const staticText = `<?xml version="1.0" encoding="UTF-8"?>
<ApexClass xmlns="urn:metadata.tooling.soap.sforce.com" fqn="${fileName}">
    <apiVersion>40.0</apiVersion>
    <status>Active</status>
</ApexClass>`;

        const resourceMetaFile = path.join(outputdir, `${fileName}.resource-meta.xml`);
        fs.createWriteStream(resourceMetaFile);

        fs.writeFile(resourceMetaFile, staticText, (err) => {
          if (err) {
            return console.log(err);
          }

          console.log(`The following Apex class and metadata file were created:\n${name}\n${resourceMetaFile}`);
          process.exit();
        });

      });

      helper.run(script, (commandResult, commandErr) => {

        if (commandErr !== undefined && commandErr !== null) {
          console.error(commandErr);
          process.exit();
        }
      });
    }
  };
}());