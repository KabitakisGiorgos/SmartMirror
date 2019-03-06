/**
 * Class of socket for clients
 *
 * @export
 * @class SocketClient
 */
export class SocketClient {
  public id: string;
  public connectedAt: Date;
  public address: string;
  public socket_id: string;
  private _socket: any;

  /**
   * Creates an instance of SocketClient.
   * @param {any} socket
   * @memberof SocketClient
   */
  constructor(socket: any) {
    this.id = socket.handshake.query.app;
    this._socket = socket;
    this.socket_id = socket.id;
    this.connectedAt = new Date();
    this.address = `${socket.request.connection.remoteAddress}:${socket.request.connection.remotePort}`;
  }

  /**
   * Check if a socket client is connected
   *
   * @returns {boolean}
   * @memberof SocketClient
   */
  isConnected(): boolean {
    return this._socket.connected;
  }

  /**
   * Send a message via sockets to client
   *
   * @param {string} event
   * @param {any} data
   * @memberof SocketClient
   */
  emitEvent(event: string, data: any) {
    this._socket.emit('message', event, data);
  }

}
