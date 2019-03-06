/**
 * Main application file
 */

/*------------------------------------------------------
* Imports
------------------------------------------------------*/
import * as http from 'http';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as sockets from './sockets/sockets.setup';
import { socketsController } from './sockets/sockets.controller';
import config from './config/environment';
import expressConfig from './config/express';
import logger from './utils/logger/logger';
import registerRoutes from './routes';

/*------------------------------------------------------
* Set Globals
------------------------------------------------------*/
global.logger = logger;
global.__socketController = socketsController;

/*------------------------------------------------------
* Database connection
*
* Connect to MongoDB if it is required
* to change, edit config.json,
* and set `db.connect: false` at environment
------------------------------------------------------*/
if (config.mongo.connect) {
  mongoose.connect(config.mongo.uri, config.mongo.options).then(() => {
    logger.verbose('MongoDB is connected on %s', config.mongo.uri);
  });
  mongoose.connection.on('error', function (err) {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
  });

  // Populate databases with sample data
  if (config.env !== 'production' && config.seedDB) { require('./utils/seed/seed'); }
}

/*------------------------------------------------------
* Setup server and express
------------------------------------------------------*/
let app = express();
let server = http.createServer(app);

/**-------------------------------------------------------------------------------
 * Setup express and routes
 *-------------------------------------------------------------------------------*/
expressConfig(app);
registerRoutes(app);

/*------------------------------------------------------
* Start server
------------------------------------------------------*/
function startServer() {
  server.listen(config.port, config.ip, () => {
    logger.verbose(`Express server listening on ${config.port}, in ${app.get('env')} mode`);
  });
}

/**-------------------------------------------------------------------------------
 * Sockets Setup for Clients
 *-------------------------------------------------------------------------------*/
sockets.setup(server)
  .then(startServer)
  .catch(err => {
    logger.error('Server failed to start due to error: %s', err);
  });

/*------------------------------------------------------
* Expose app
------------------------------------------------------*/
exports = module.exports = app;
