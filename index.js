const orgcreate = require('./commands/apex_wsdl_convert.js');

(function () {
  'use strict';

  exports.topics = [{
    name: 'apex',
    description: 'perform user-related admin tasks'
  }];

  exports.namespace = {
    name: 'waw',
    description: ''
  };

  exports.commands = [orgcreate];

}());