/*-------------------------------------------------
* Global Declarations
--------------------------------------------------*/

declare class ClientsSocketController {
  constructor();

  /**
   * Registers a new client when a socket is connected
   * and adds it to client list
   *
   * @param {any} socket
   * @memberof ClientsSocketController
   */
  public register(socket: any);
  /**
  * Deletes a socket client when is disconnected
  * and removes it from client list
  *
  * @param {any} socket
  * @memberof ClientsSocketController
  */
  public unregister(socket: any);
  /**
   * Send message to all clients
   *
   * @param {string} message_type
   * @param {*} message
   * @memberof ClientsSocketController
   */
  public broadcastMessage(message_type: string, message: any);
  /**
   * Send message to specific client
   *
   * @param {string} message_type
   * @param {*} message
   * @memberof ClientsSocketController
   */
  public sendMessage(client_id: string, message_type: string, message: any);
}

declare namespace NodeJS {
  export interface Global {
    logger: any;
    __socketController: ClientsSocketController;
  }
}

interface Logger {
  silly(message: any): void;
  debug(message: any): void;
  verbose(message: any): void;
  info(message: any): void;
  warn(message: any): void;
  error(message: any): void;
}
