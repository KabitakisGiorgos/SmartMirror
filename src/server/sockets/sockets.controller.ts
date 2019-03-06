import * as _ from 'lodash';
import { SocketClient } from './client/sockets.client';

/**
 * Class of global controller for socket clients
 *
 * @class ClientsSocketController
 */
class ClientsSocketController {
  private _socketClients: SocketClient[];

  /**
   * Creates an instance of ClientsSocketController.
   * @memberof ClientsSocketController
   */
  constructor() {
    this._socketClients = [];
  }

  /**
   * Registers a new client when a socket is connected
   * and adds it to client list
   *
   * @param {any} socket
   * @memberof ClientsSocketController
   */
  public register(socket: any) {
    let client = new SocketClient(socket);
    this._socketClients.push(client);
    global.logger.info(`[Sockets] ${socket.handshake.query.app}:\t --- \t CONNECTED`);
    this.logRegisteredClinets();
  }

  /**
   * Deletes a socket client when is disconnected
   * and removes it from client list
   *
   * @param {any} socket
   * @memberof ClientsSocketController
   */
  public unregister(socket: any) {
    _.remove(this._socketClients, { socket_id: socket.id });
    global.logger.info(`[Sockets] ${socket.handshake.query.app}:\t --- \t DISCONNECTED`);
    this.logRegisteredClinets();
  }

  /**
   * Send message to all clients
   *
   * @param {string} message_type
   * @param {*} message
   * @memberof ClientsSocketController
   */
  public broadcastMessage(message_type: string, message: any) {
    this.emitEventToClient(message_type, message);
  }

  /**
   * Send message to specific client
   *
   * @param {string} message_type
   * @param {*} message
   * @memberof ClientsSocketController
   */
  public sendMessage(client_id: string, message_type: string, message: any) {
    this.emitEventToClient(message_type, message, client_id);
  }

  // -------------------------------------------------------------
  // #region Begin private methods

  /**
   * Sends a message to clients
   *
   * @private
   * @param {string} event
   * @param {*} message
   * @param {string} [client_id]
   * @memberof ClientsSocketController
   */
  private emitEventToClient(event: string, message: any, client_id?: string) {
    let wasSent = false;
    _.each(this._socketClients, (client) => {
      if (client_id) {
        if (client.id === client_id && client.isConnected()) {
          client.emitEvent(event, message);
          wasSent = true;
        }
      } else { // broadcast message
        client.emitEvent(event, message);
      }
    });

    if (client_id && !wasSent) { // event was not sent to specific client
      //Do something
    }
  }

  /**
   * Debug method: Logs registered socket clients
   *
   * @memberof ClientsSocketController
   */
  private logRegisteredClinets() {
    global.logger.info('REGISTERED CLIENTS: ' + this._socketClients.length);
  }

  // #endregion END private methods
  // -------------------------------------------------------------
}

export let socketsController = new ClientsSocketController();
