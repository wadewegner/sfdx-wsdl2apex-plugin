# sfdx-wsdl2apex-plugin

A plugin that lets you convert WSDL into Apex classes. Makes use of [WSDL2Apex](https://github.com/forcedotcom/WSDL2Apex) for the heavy lifting.

## Setup

This plugin requires the Salesforce CLI.

### Install as plugin

Install plugin: `sfdx plugins:install sfdx-oss-plugin`

### Install from source

1. Clone the repository: `git clone git@github.com:wadewegner/sfdx-wsdl2apex-plugin.git`

2. Install npm modules: `npm install`

3. Link the plugin: `sfdx plugins:link .`

## Use

Convert: `sfdx waw:apex:wsdl:convert -p resources/parks.xml -d out`