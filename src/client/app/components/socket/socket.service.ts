import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { noop, find, remove } from 'lodash';
import constants from '../../app.constants';

@Injectable()
export class SocketService {
  socket;
  app_name: string;

  constructor(
    private activatedRoute: ActivatedRoute) { }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.app_name = this.activatedRoute.snapshot.queryParams['app'];
      this.socket = io('', {
        path: '/socket.io-client',
        query: {
          token: constants.sockets_token,
          app: this.app_name
        }
      });
      resolve();
    });
  }

  onConnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('connect', () => observer.complete());
    });
  }

  onDisconnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('disconnect', () => observer.complete());
    });
  }

  /**
   * Register listeners to sync an array with updates on a model
   *
   * Takes the array we want to sync, the model name that socket updates are sent from,
   * and an optional callback function after new items are updated.
   *
   * @param {String} modelName
   * @param {Array} array
   * @param {Function} cb
   */
  syncUpdates(cb?, modelName?, array?) {
    cb = cb || noop;

    /**
     * Syncs item creation/updates on 'model:save'
     */
    this.socket.on('message', function (event_message, item) {

        cb(event_message, item);
        
    });
  }

  /**
   * Removes listeners for a models updates on the socket
   *
   * @param modelName
   */
  unsyncUpdates(modelName) {
    this.socket.removeAllListeners(`message`);
    this.socket.disconnect();
  }
}
