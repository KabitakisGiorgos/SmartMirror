import { Injectable } from '@angular/core';
// import * as Leap from '../../../../LeapMotionTS/build/leapmotion-ts-2.2.4';
import { Cursor } from '../Cursor/cursor';
// import { debugMode } from '../../environments/environment';
import * as Leap from 'leapjs'

@Injectable({
  providedIn: 'root'
})
export class LeapHandlerService {
  controller: Leap.Controller;
  leapTimer: number = 0;
  cursorOn: boolean = false;
  leapLastTimeNoHand: number = 0;
  cursor: Cursor;

  constructor() {
    this.cursor = new Cursor();
    // this.debug = debugMode['LeapHandlerService'];
    this.init();
  }

  init() {
    this.controller = new Leap.Controller();
  }
}
