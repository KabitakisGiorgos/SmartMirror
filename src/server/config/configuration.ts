/**
 * A class to generalize configuration for AmIModule Configuration
 * Simple usage to get/set ports and other values that want to be
 * configurable over the Solertis Platform
 */

var fs = require('fs');
var appRoot = require('app-root-path');

/* --------------------------------------------------------------- */

const CONFIGFILE = appRoot.path + '/config/config.json'; //TODO get this dynamicly from central project

try {
    var globalConfig = fs.readFileSync(CONFIGFILE, 'utf8');
    globalConfig = JSON.parse(globalConfig);
} catch (e) {
    throw new ConfigException('Error while trying to read config file. Please make sure that there is a correct json config file at '
        + CONFIGFILE);
}

/* --------------------------------------------------------------- */

var saveConfiguration = () => {
    //validate 
    fs.writeFileSync(CONFIGFILE, JSON.stringify(globalConfig, null, 2), 'utf8');
};

/* --------------------------------------------------------------- */

const GENERAL = 'general';
class GeneralConfiguration {
    config: any;
    saveConfig: any;
    /* ------------------------------------ */

    constructor(type) {
        if (type === GENERAL)
            this.config = globalConfig.general;
        else
            this.config = globalConfig[type].general; //e.g. development.general
        this.saveConfig = saveConfiguration;
    }

    /* ------------------------------------ */

    getValue(key) {
        return this.config[key];
    }

    setValue(key, value) {
        this.config[key] = value;
        this.saveConfig();
    }

    /* ------------------------------------ */

    validateConfig() {
        //check if it contains the needed values ()

    }

}

/* --------------------------------------------------------------- */

class ExpressConfiguration {

    /* ------------------------------------ */
    config: any;
    saveConfig: any;
    constructor(type) {
        this.config = globalConfig[type].express;
        this.saveConfig = saveConfiguration;
    }

    /* ------------------------------------ */

    getPort() {
        return this.config.port;
    }

    setPort(port) {
        this.config.port = port;
        this.saveConfig();
    }

    /* ------------------------------------ */

    getValue(key) {
        return this.config[key];
    }

    setValue(key, value) {
        this.config[key] = value;
        this.saveConfig();
    }

    /* ------------------------------------ */

    validateConfig() {
        //check if it contains the needed values ()

    }

}

/* --------------------------------------------------------------- */

class MongoDBConfiguration {

    /* ------------------------------------ */
    config: any;
    saveConfig: any;
    constructor(type) {
        this.config = globalConfig[type].mongodb;
        this.saveConfig = saveConfiguration;
    }

    /* ------------------------------------ */

    getPort() {
        return this.config.port;
    }

    setPort(port) {
        this.config.port = port;
        this.saveConfig();
    }

    /* ------------------------------------ */

    getHost() {
        return this.config.host;
    }

    setHost(host) {
        this.config.host = host;
        this.saveConfig();
    }

    /* ------------------------------------ */

    getName() {
        return this.config.name;
    }

    setName(name) {
        this.config.name = name;
        this.saveConfig();
    }

    /* ------------------------------------ */

    /* ------------------------------------ */

    getValue(key) {
        return this.config[key];
    }

    setValue(key, value) {
        this.config[key] = value;
        this.saveConfig();
    }

    /* ------------------------------------ */

    validateConfig() {
        //check if it contains the needed values ()

    }

}

/* --------------------------------------------------------------- */

class RedisConfiguration {

    /* ------------------------------------ */
    config: any;
    saveConfig: any;
    constructor(type) {
        this.config = globalConfig[type].redis;
        this.saveConfig = saveConfiguration;
    }

    /* ------------------------------------ */

    getPort() {
        return this.config.port;
    }

    setPort(port) {
        this.config.port = port;
        this.saveConfig();
    }

    /* ------------------------------------ */

    getIP() {
        return this.config.ip;
    }

    setIP(ip) {
        this.config.ip = ip;
        this.saveConfig();
    }

    /* ------------------------------------ */

    getPassword() {
        return this.config.password;
    }

    setPassword(password) {
        this.config.password = password;
        this.saveConfig();
    }

    /* ------------------------------------ */

    getValue(key) {
        return this.config[key];
    }

    setValue(key, value) {
        this.config[key] = value;
        this.saveConfig();
    }

    /* ------------------------------------ */

    validateConfig() {
        //check if it contains the needed values ()

    }

}

/* --------------------------------------------------------------- */

module.exports.getConfig = function (type) {
    return {
        general: new GeneralConfiguration(type),
        express: new ExpressConfiguration(type),
        db: new MongoDBConfiguration(type),
        redis: new RedisConfiguration(type),
    };
};

module.exports.getGeneralConfig = function () {
    return new GeneralConfiguration(GENERAL);
};


module.exports.getEnvironment = function () {
    return globalConfig.environment;
};

module.exports.setEnvironment = function (environment) {
    globalConfig.environment = environment;
    saveConfiguration();
};

function ConfigException(message) {
    this.message = message;
    this.name = 'ConfigException';
}

module.exports.ConfigException = ConfigException;

/* --------------------------------------------------------------- */

