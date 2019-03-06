
var config = require('./configuration.js');

/* --------------------------------------------------------------- */

const ENVIRONMENTS = {
    production: 'production',
    test: 'test',
    development: 'development',
};

/* --------------------------------------------------------------- */

var development = config.getConfig('development');
var production = config.getConfig('production');
var test = config.getConfig('test');
var general = config.getGeneralConfig();

var getConfig = function (env) {
    switch (env) {
        case ENVIRONMENTS.development:
            return development;
        case ENVIRONMENTS.production:
            return production;
        case ENVIRONMENTS.test:
            return test;
        default:
            throw new config.ConfigException("Error environment '" + env + "' is not supported");
    }
};

/* --------------------------------------------------------------- */

var getCurrentEnvironment = function () {
    return getConfig(getEnvironment());
};

/* --------------------------------------------------------------- */

var getEnvironment = function () {
    return config.getEnvironment();
};

var setEnvironment = function (env) {
    config.setEnvironment(env);
};

/* --------------------------------------------------------------- */

module.exports = {
    general : general,
    development: development,
    production: production,
    test: test,
    getConfig: getConfig,
    getCurrentEnvironment : getCurrentEnvironment,
    getEnvironment: getEnvironment,
    setEnvironment: setEnvironment,
    ENVIRONMENTS: ENVIRONMENTS,
};