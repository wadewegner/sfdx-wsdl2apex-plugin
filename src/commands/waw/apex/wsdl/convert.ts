import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { AnyJson } from "@salesforce/ts-types";
const path = require("path");
const helper = require('../../../../shared/helper.js');
const fse = require("fs-extra");
const watch = require("node-watch");
const fs = require('fs');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages(
  "sfdx-wsdl2apex-plugin",
  "apex-wsdl-convert"
);

export default class Convert extends SfdxCommand {
  public static description = messages.getMessage("commandDescription");

  public static examples = [
    `$ sfdx waw:apex:wsdl:convert -p resources/parks.xml -d out
  `
  ];

  protected static flagsConfig = {
    pathtowsdl: flags.string({
      char: "p",
      description: messages.getMessage("pathFlagDescription"),
      required: true
    }),
    outputdir: flags.string({
      char: "d",
      description: messages.getMessage("outputFlagDescription"),
      required: true
    }),
    async: flags.boolean({
      char: "a",
      description: messages.getMessage("asyncFlagDescription"),
      required: false
    }),
    apiversion: flags.builtin()
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static requiresDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
 
    const pathToWsdl = this.flags.pathtowsdl;
    const outputdir = this.flags.outputdir;
    let asyncFlag = this.flags.async;
    let async = "yes";
    let result = '';

    const apiVersion = this.flags.apiversion ? this.flags.apiversion : '46.0';
    
    if (asyncFlag === undefined || asyncFlag === null) {
      async = "no";
    }
    
    fse.ensureDirSync(outputdir);

    const apexWsdlPath = path.resolve(__dirname, path.join('..','..','..','..','..'));
    const jarPath = path.join(apexWsdlPath,"resources", "WSDL2Apex-1.0.jar");
    const script = `java -jar ${jarPath} ${pathToWsdl} ${outputdir} ${async}`;

    watch(
      outputdir,
      {
        recursive: true
      },
      function(evt, name) {

        const fileName = path.basename(name, ".cls");

        const staticText = `<?xml version="1.0" encoding="UTF-8"?>
<ApexClass xmlns="urn:metadata.tooling.soap.sforce.com" fqn="${fileName}">
    <apiVersion>${apiVersion}</apiVersion>
    <status>Active</status>
</ApexClass>`;

        const resourceMetaFile = path.join(
          outputdir,
          `${fileName}.resource-meta.xml`
        );

        fs.createWriteStream(fileName);

        fs.writeFile(resourceMetaFile, staticText, err => {
          if (err) {
            console.log(err);
            process.exit();
          }

          result = `The following Apex class and metadata file were created:\n${name}\n${resourceMetaFile}`;
          console.log(result);
          process.exit();
        });
      }
    );

    helper.run(script, (commandResult, commandErr) => {

      if (commandErr !== undefined && commandErr !== null) {
        console.log(commandErr);
        process.exit();
      }
    });

    // Return an object to be displayed with --json
    // TODO: this is happening before watch is over, need some refactoring
    return {};
  }
}
