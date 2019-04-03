import { Injectable } from '@angular/core';
import { Cursor } from '../Cursor/cursor';
import config from './config.json';
import * as Leap from 'leapjs'
import { debugMode } from '../../environments/environment';
import * as $ from 'jquery'
//FIXME: start fixing the controller about which dom have i selected

@Injectable({
  providedIn: 'root'
})
export class LeapHandlerService {
  controller: Leap.Controller;
  leapTimer: number = 0;
  cursorOn: boolean = false;
  leapLastTimeNoHand: number = 0;
  cursor: Cursor;
  cursorTimer: number = 0;
  delayTimer: number = 0;

  constructor() {
    this.cursor = new Cursor(debugMode.Cursor);
    this.enableCursor();
    if (!debugMode.Cursor)
      this.init();
  }

  init() {
    this.controller = new Leap.Controller({ enableGestures: true });
    //Not really good idea to have cursor and swipe gestures
    this.controller.loop(async (frame) => {
      var pointable = frame.hands[0];
      if (pointable) {
        if (this.delayTimer > 0)
          this.cursorTimer += performance.now() - this.delayTimer;
        this.delayTimer = performance.now();

        var detect = await this.detectFingers(pointable.fingers);
        if (detect === 'closed' && this.cursorTimer > config.leap.cursorHide) {
          this.cursorTimer = 0;
          if (this.cursorOn)
            this.disableCursor();
          else this.enableCursor();
        }
      }

      if (this.cursorOn) {
        var appWidth = $(window).width();
        var appHeight = $(window).height();

        var iBox = frame.interactionBox;

        if (pointable != undefined) {
          this.cursor.SetOrientation(pointable.type);

          this.leapTimer = 0;
          var leapPoint = pointable.stabilizedPalmPosition;
          var normalizedPoint = iBox.normalizePoint(leapPoint, true);

          var appX = normalizedPoint[0] * appWidth;
          var appY = (1 - normalizedPoint[1]) * appHeight;
          this.cursor.Move(appY, appX);

        } else {
          if (!this.cursorOn)
            return;

          if (this.leapLastTimeNoHand > 0)
            this.leapTimer += performance.now() - this.leapLastTimeNoHand;
          this.leapLastTimeNoHand = performance.now();

          if (this.leapTimer > config.leap.hideTimer
          ) {
            this.disableCursor();
          }
        }
      }
    });

    this.controller.on('gesture', (gesture, frame) => {
      if (gesture.type == 'swipe' && !this.cursorOn) {
        console.log(gesture.type + " with ID " + gesture.id + " in frame " + frame.id);
      }
    });
  }


  enableCursor() {
    this.cursorOn = true;
    this.cursor.Show();
  }

  disableCursor() {
    this.cursor.Hide();
    this.cursorOn = false;
  }

  detectFingers(fingersArray) {
    return new Promise((resolve, reject) => {
      fingersArray.forEach((element, index) => {
        if (element.extended) resolve('open');
        if (index == fingersArray.length - 1) resolve('closed');
      });
    });
  }
}
