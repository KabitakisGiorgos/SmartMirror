import * as amiconfig from '@amisolertis/utils-config';

let envConfig = amiconfig.getConfig(amiconfig.ENVIRONMENTS.production);

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
  || process.env.ip
  || envConfig.express.getValue('ip')
  || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
  || process.env.PORT
  || envConfig.express.getPort()
  || 8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI
    || process.env.MONGOHQ_URL
    || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME
    || `mongodb://${envConfig.db.getHost()}:${envConfig.db.getPort()}/${envConfig.db.getName()}`
  }
};
