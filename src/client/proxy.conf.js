var config = require(`../../dist/server/config/environment`).default;

var PROXY_CONFIG = {
  '/api': {
    target: `http://localhost:${config.port}`,
    secure: false,
  },
  '/auth': {
    target: `http://localhost:${config.port}`,
    secure: false,
  },
  '/socket.io-client': {
    target: `http://localhost:${config.port}`,
    secure: false,
  }
}

module.exports = PROXY_CONFIG;
