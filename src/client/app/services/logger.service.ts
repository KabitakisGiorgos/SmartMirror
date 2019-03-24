import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { debugMode } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private logger: NGXLogger) {

  }

  debug(message:any, module: string) {
    if (debugMode[module]) {
      this.logger.debug(message);
    }
  }

  error(message: any) {
    this.logger.error(message);
  }

  log(message: any, module: string) {
    if (debugMode[module]) {
      this.logger.log(message);
    }
  }

  info(message: any, module: string) {
    if (debugMode[module]) {
      this.logger.info(message);
    }
  }
}
