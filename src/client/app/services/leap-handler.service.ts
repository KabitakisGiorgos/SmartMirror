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

    this.controller.loop((frame) => {
      // NOOP
      var appWidth = $(window).width();
      var appHeight = $(window).height();

      var iBox = frame.interactionBox;
      var pointable = frame.hands[0];

      if (pointable != undefined) {
        this.cursor.SetOrientation(pointable.type);
        this.cursor.Show();

        this.leapTimer = 0;
        var leapPoint = pointable.stabilizedPalmPosition;
        var normalizedPoint = iBox.normalizePoint(leapPoint, true);

        var appX = normalizedPoint[0] * appWidth;
        var appY = (1 - normalizedPoint[1]) * appHeight;
        this.cursorOn = true;
        this.cursor.Move(appY, appX);
      } else {
        if (!this.cursorOn)
          return;

        if (this.leapLastTimeNoHand > 0)
          this.leapTimer += performance.now() - this.leapLastTimeNoHand;
        this.leapLastTimeNoHand = performance.now();

        if (this.leapTimer > 1500) {//FIXME: add it to  a config
          this.cursor.Hide();
          this.cursorOn = false;
        }
      }

    });
  }
}
