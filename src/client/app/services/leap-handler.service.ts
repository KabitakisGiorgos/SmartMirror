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
  private repeatedAction: boolean = false;
  private swipeThreshold: boolean = false;
  private enableThreshold: number = 0;

  constructor(private events: EventsService) {
    this.cursor = new Cursor(events, debugMode.Cursor);
    this.enableCursor();
    if (!debugMode.Cursor)
      this.init();
  }

  private init() {
    this.controller = new Leap.Controller({ enableGestures: true });
    this.controller.loop(async (frame) => {
      var pointable = frame.hands[0];
      if (pointable) {

        var detect = await this.detectFingers(pointable.fingers);
        if (detect === 'closed') this.enableThreshold++;

        if (this.enableThreshold > 100) {
          this.enableThreshold = 0;
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
        if (!this.swipeThreshold) {
          if (debugMode.LeapHandlerService) console.log(this.swipeDirection(gesture));
          this.events.publish('swipe', this.swipeDirection(gesture));
        }
        this.enableThreshold = 0;
        this.swipeThreshold = true;
        setTimeout(() => {
          this.swipeThreshold = false;
        }, 2500);
      }
      if (gesture.type === 'keyTap' && this.cursorOn && !this.repeatedAction) {
        this.cursor.clickElement();
        this.repeatedAction = true;
        setTimeout(() => {
          this.repeatedAction = false;
        }, 500);
      }
    });
  }


  private enableCursor() {
    this.cursorOn = true;
    this.cursor.Show();
    this.events.publish('cursor', { visibility: this.cursorOn });
  }

  private disableCursor() {
    this.cursor.Hide();
    this.cursorOn = false;
    this.events.publish('cursor', { visibility: this.cursorOn });
    this.cursor.setSelectedElement(null);
  }

  private detectFingers(fingersArray) {
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

  private swipeDirection(gesture) {
    if (gesture.type !== 'swipe') {
      throw 'Not swipe gesture';
    } else {
      let isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
      if (isHorizontal) {
        if (gesture.direction[0] > 0) {
          return 'right';
        } else {
          return 'left';
        }
      } else {//Vertical swipe
        if (gesture.direction[1] > 0) {
          return 'up';
        } else {
          return 'down';
        }
      }
    }
  }

  cursorTapping() {
    return this.cursor.tapping();
  }
}
