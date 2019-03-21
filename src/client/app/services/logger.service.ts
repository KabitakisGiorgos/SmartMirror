import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { debugMode } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private logger: NGXLogger) {

  }

  debug(message: string, module: string) {
    if (debugMode[module]) {
      this.logger.debug(message);
    }
  }

  error(message: string) {
    this.logger.error(message);
  }

  log(message: string, module: string) {
    if (debugMode[module]) {
      this.logger.log(message);
    }
  }

  info(message: string, module: string) {
    if (debugMode[module]) {
      this.logger.info(message);
    }
  }
}
