import * as amiconfig from '@amisolertis/utils-config';

let _env = amiconfig.getEnvironment() || process.env.NODE_ENV || 'development';
let envConfig = amiconfig.getConfig(_env);

module.exports.default = {
  env: amiconfig.getEnvironment() || process.env.NODE_ENV,
  port: envConfig.express.getPort() || process.env.PORT || 9000,

  // Add here global config for server and client.
  // E.g:
  //userRoles: ['guest', 'user', 'admin']
};
