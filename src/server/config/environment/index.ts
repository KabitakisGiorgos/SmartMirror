import * as path from 'path';
import * as _ from 'lodash';
import * as amiconfig from '@amisolertis/utils-config';

let _env = amiconfig.getEnvironment() || process.env.NODE_ENV || 'development';
let envConfig = amiconfig.getConfig(_env);

// All configurations will extend these options
// ============================================
let all = {
  env: amiconfig.getEnvironment() || process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // client port (only for dev)
  clientPort: envConfig.general.getValue('clientPort') || process.env.CLIENT_PORT || 3000,

  // Server port
  port: envConfig.express.getPort() || process.env.PORT || 9000,

  // Server IP
  ip: envConfig.express.getValue('ip') || process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: envConfig.db.getValue('seedDB'),

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'fullstack-secret'
  },

  // MongoDB connection options
  mongo: {
    connect: envConfig.db.getValue('connect')
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
export default _.merge(
  all,
  require('./shared').default,
  require(`./${_env}.js`) || {}
);

