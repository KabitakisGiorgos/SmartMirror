import * as amiconfig from '@amisolertis/utils-config';

let envConfig = amiconfig.getConfig(amiconfig.ENVIRONMENTS.development);

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: `mongodb://${envConfig.db.getHost()}:${envConfig.db.getPort()}/${envConfig.db.getName()}`
    || 'mongodb://localhost/fullstack-seed-dev'
  },

  // Seed database on startup
  seedDB: envConfig.db.getValue('seedDB')
};
