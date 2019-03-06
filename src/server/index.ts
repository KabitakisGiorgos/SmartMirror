import * as amiconfig from '@amisolertis/utils-config';

// Set default node environment to development
process.env.NODE_ENV = amiconfig.getEnvironment() || process.env.NODE_ENV || 'development';

// Export the application
exports = module.exports = require('./app');
