import * as amiconfig from '@amisolertis/utils-config';

let envConfig = amiconfig.getConfig(amiconfig.ENVIRONMENTS.test);

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: `mongodb://${envConfig.db.getHost()}:${envConfig.db.getPort()}/${envConfig.db.getName()}`
    || 'mongodb://localhost/fullstack-seed-test'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  }
};
