import { Injectable } from '@angular/core';
import * as Leap from '../../../../LeapMotionTS/build/leapmotion-ts-2.2.4';
import { Cursor } from '../Cursor/cursor';
// import { debugMode } from '../../environments/environment';

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
    this.controller.addEventListener(Leap.LeapEvent.LEAPMOTION_CONNECTED, (event: Leap.LeapEvent) => {
      this.controller.enableGesture(Leap.Type.TYPE_SWIPE, true);
      this.controller.enableGesture(Leap.Type.TYPE_SCREEN_TAP, true);
      this.controller.enableGesture(Leap.Type.TYPE_KEY_TAP, true);
      this.controller.addEventListener(Leap.LeapEvent.LEAPMOTION_FRAME, (event: Leap.LeapEvent) => {
        var frame: Leap.Frame = event.frame;

        var gestures: Leap.Gesture[] = frame.gestures();
        for (var i: number = 0; i < gestures.length; i++) {
          var gesture: Leap.Gesture = gestures[i];
          switch (gesture.type) {
            case Leap.Type.TYPE_SCREEN_TAP:
              var screenTap: Leap.ScreenTapGesture = <Leap.ScreenTapGesture>gesture;
              console.log('Screen Tap id:' + screenTap.id + ', ' + screenTap.state + ', position:' + screenTap.position + ', direction:' + screenTap.direction);
              break;
            case Leap.Type.TYPE_KEY_TAP:
              var keyTap: Leap.KeyTapGesture = <Leap.KeyTapGesture>gesture;
              console.log('Key Tap id:' + keyTap.id + ', ' + keyTap.state + ', position:' + keyTap.position + ', direction:' + keyTap.direction);
              break;
            case Leap.Type.TYPE_SWIPE:
              let swipeDirection: string;
              var swipe: Leap.SwipeGesture = <Leap.SwipeGesture>gesture;
              var isHorizontal = Math.abs(swipe.direction.x) > Math.abs(swipe.direction.y);
              //Classify as right-left or up-down
              if (isHorizontal) {
                if (swipe.direction.x > 0) {
                  swipeDirection = 'right';
                } else {
                  swipeDirection = 'left';
                }
              } else { //vertical
                if (swipe.direction.y > 0) {
                  swipeDirection = 'up';
                } else {
                  swipeDirection = 'down';
                }
              }
              console.log(swipeDirection)
              // console.log('Swipe id:' + swipe.id + ', ' + swipe.state + ', position:' + swipe.position + ', direction:' + swipe.direction + ', speed:' + swipe.speed);
              break;
          }
        }

        //     var appWidth = $(window).width();
        //     var appHeight = $(window).height();

        //     var iBox = frame.interactionBox;
        //     var pointable = frame.hands[0];

        //     if (pointable != undefined) {
        //       this.cursor.Show();
        //       this.leapTimer = 0;
        //       var leapPoint = pointable.stabilizedPalmPosition;
        //       var normalizedPoint = iBox.normalizePoint(leapPoint, true);

        //       var appX = normalizedPoint.x * appWidth;
        //       var appY = (1 - normalizedPoint.y) * appHeight;
        //       this.cursorOn = true;
        //       this.cursor.Move(appY, appX);
        //     } else {
        //       if (!this.cursorOn)
        //         return;

        //       if (this.leapLastTimeNoHand > 0)
        //         this.leapTimer += performance.now() - this.leapLastTimeNoHand;
        //       this.leapLastTimeNoHand = performance.now();

        //       if (this.leapTimer > 1500) {//FIXME: add
        //         this.cursor.Hide();
        //         this.cursorOn = false;
        //       }
        //     }
      });
    });



  }
}
