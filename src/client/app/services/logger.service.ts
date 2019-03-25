import { Injectable } from '@angular/core';
import { debugMode } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() {

  }

  debug(message: any, module: string) {
    if (debugMode[module]) {
      console.debug(message);
    }
  }

  error(message: any) {
    console.error(message);
  }

  log(message: any, module: string) {
    if (debugMode[module]) {
      console.log(message)
    }
  }

  info(message: any, module: string) {
    if (debugMode[module]) {
      console.info(message);
    }
  }
}
