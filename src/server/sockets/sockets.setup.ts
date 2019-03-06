import * as io from 'socket.io';
import * as amiconfig from '@amisolertis/utils-config';

function isValidToken(token: string) {
  const _key: string = amiconfig.general.getValue('sockets_token');
  return token && token === _key;
}

/**
 * Socket.io configuration for socket clients
 *
 * @export
 * @param {any} server
 */
export function setup(server): Promise<any> {
  return new Promise((resolve, reject) => {

    let socketio = io(server, { path: '/socket.io-client' });

    // Middleware for authentication
    socketio.use(function (socket, next) {
      let token = socket.handshake.query.token;
      if (isValidToken(token)) {
        if (socket.handshake.query.app) {
          return next();
        }
        global.logger.error('[Sockets] No app name provided...');
        return next(new Error('No app name provided...'));
      }
      global.logger.error('[Sockets] Authenitcation failed on socket connection...');
      return next(new Error('Authenitcation failed on socket connection...'));
    });

    socketio.on('connection', function (socket) {
      // Call onDisconnect.
      socket.on('disconnect', () => {
        global.__socketController.unregister(socket);
      });

      // When the user connects.. perform this
      global.__socketController.register(socket);
    });

    resolve(socketio);
  });
}
