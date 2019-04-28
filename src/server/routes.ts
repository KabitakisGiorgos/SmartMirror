/**
 * Main application routes
 */
import * as path from 'path';
import * as errors from './components/errors';
import thingRouter from './api/thing';
import notificationRouter from './api/notifications';
import newsRouter from './api/news'
import eventsRouter from './api/events';

export default app => {
  // Insert routes below
  app.use('/api/notifications', notificationRouter);
  app.use('/api/things', thingRouter);
  app.use('/api/news', newsRouter);
  app.use('/api/events', eventsRouter);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors.pageNotFound);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
};
