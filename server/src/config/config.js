import convict from 'convict';
import appRootPath from 'app-root-path';
import fileExists from 'file-exists';

import schema from "./convictSchema";

console.log("Setting up convict with schema:", schema);

// Define a schema
const config = convict(schema);

// Load environment dependent configuration
const env = config.get('env');
const confFilePath = appRootPath + '/server/.config/' + env + '.json';

if (fileExists.sync(confFilePath)) {
  config.loadFile(confFilePath);
} else {
  console.log(`Failed to load ${confFilePath}`);
}

console.log("Validating configurations:", config.toString());

// Perform validation
config.validate({allowed: 'strict'});

export default config;
