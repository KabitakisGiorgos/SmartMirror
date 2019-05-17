import { Injectable } from '@angular/core';
import { Cursor } from '../Cursor/cursor';
import config from './config.json';
import * as Leap from 'leapjs'
import { debugMode } from '../../environments/environment';
import * as $ from 'jquery'
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root'
})
export class LeapHandlerService {
  private controller: Leap.Controller;
  private leapTimer: number = 0;
  private cursorOn: boolean = false;
  private leapLastTimeNoHand: number = 0;
  private cursor: Cursor;
  private cursorTimer: number = 0;
  private delayTimer: number = 0;

  constructor(private events: EventsService) {
    this.cursor = new Cursor(events, debugMode.Cursor);
    this.enableCursor();
    if (!debugMode.Cursor)
      this.init();
  }

  init() {
    this.controller = new Leap.Controller({ enableGestures: true });
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
      if (gesture.type === 'keyTap' && this.cursorOn) {
        this.cursor.clickElement();
      }
    });
  }


  enableCursor() {
    this.cursorOn = true;
    this.cursor.Show();
    this.events.publish('cursor', { visibility: this.cursorOn });//TESTME: or move it to the cursor.ts
  }

  disableCursor() {
    this.cursor.Hide();
    this.cursorOn = false;
    this.events.publish('cursor', { visibility: this.cursorOn });
    this.cursor.setSelectedElement(null);
  }

  detectFingers(fingersArray) {
    return new Promise((resolve, reject) => {
      fingersArray.forEach((element, index) => {
        if (element.extended) resolve('open');
        if (index == fingersArray.length - 1) resolve('closed');
      });
    });
  }

  registerDivs(array: Array<string>) {
    this.cursor.registerSelectableDivs(array);
  }

  unregisterDivs(array: Array<string>) {
    this.cursor.unregisterSelectableDivs(array);
  }

  registerAnimatingDivs(array: Array<string>) {
    this.cursor.registerAnimatingDivs(array);
  }

  unregisterAnimatingDivs(array: Array<string>) {
    this.cursor.unregisterAnimatingDivs(array);
  }

  isCursorVisible() {
    return this.cursor.IsVisible();
  }
}
