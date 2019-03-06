/**
 * Express configuration
 */

import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as cookieParser from 'cookie-parser';
import * as errorHandler from 'errorhandler';
import * as path from 'path';
import * as ejs from 'ejs';
import config from './environment';

export default (app) => {
  var env = app.get('env');
  var clientPath = path.join(config.root, '../src/client');
  var serverPath = path.join(config.root, '../src/server');

  if (env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
  }

  if (env === 'production') {
    clientPath = path.join(config.root, 'client');
    serverPath = path.join(config.root, 'server');
  }

  app.set('appPath', clientPath);
  app.use(express.static(app.get('appPath')));
  app.use(morgan('dev'));

  app.set('views', `${serverPath}/views`);
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  if (env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
};
