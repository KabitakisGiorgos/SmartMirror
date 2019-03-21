import { Injectable } from '@angular/core';
import * as Leap from '../../../../LeapMotionTS/build/leapmotionts-2.2.4';
// import { debugMode } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeapHandlerService {
  controller: Leap.Controller;
  debug: boolean;

  constructor() {
    // this.debug = debugMode['LeapHandlerService'];
    this.init();
  }

  init() {
    this.controller = new Leap.Controller();
    this.controller.addEventListener(Leap.LeapEvent.LEAPMOTION_CONNECTED, (event: Leap.LeapEvent) => {
      this.controller.enableGesture(Leap.Type.TYPE_CIRCLE, true);
      this.controller.enableGesture(Leap.Type.TYPE_SWIPE, true);
      this.controller.enableGesture(Leap.Type.TYPE_SCREEN_TAP, true);
      this.controller.enableGesture(Leap.Type.TYPE_KEY_TAP, true);
    });
    this.controller.addEventListener(Leap.LeapEvent.LEAPMOTION_FRAME, (event: Leap.LeapEvent) => {
      var frame: Leap.Frame = event.frame;
      // console.log("Frame id:" + frame.id + ", timestamp:" + frame.timestamp + ", hands:" + frame.hands.length + ", fingers:" + frame.fingers.length + ", tools:" + frame.tools.length + ", gestures:" + frame.gestures().length);

      if (frame.hands.length > 0) {
        // Get the first hand
        var hand: Leap.Hand = frame.hands[0];

        // Check if the hand has any fingers
        var fingers: Leap.Finger[] = hand.fingers;
        if (fingers.length > 0) {
          // Calculate the hand's average finger tip position
          var avgPos: Leap.Vector3 = Leap.Vector3.zero();
          for (var i: number = 0; i < fingers.length; i++)
            avgPos = avgPos.plus((<Leap.Finger>fingers[i]).tipPosition);

          avgPos = avgPos.divide(fingers.length);
          // console.log("Hand has " + fingers.length + " fingers, average finger tip position:" + avgPos);
        }

        // Get the hand's sphere radius and palm position
        // console.log("Hand sphere radius:" + hand.sphereRadius + " mm, palm position:" + hand.palmPosition);

        // Get the hand's normal vector and direction
        var normal: Leap.Vector3 = hand.palmNormal;
        var direction: Leap.Vector3 = hand.direction;

        // Calculate the hand's pitch, roll, and yaw angles
        // console.log("Hand pitch:" + Leap.LeapUtil.toDegrees(direction.pitch) + " degrees, " + "roll:" + Leap.LeapUtil.toDegrees(normal.roll) + " degrees, " + "yaw:" + Leap.LeapUtil.toDegrees(direction.yaw) + " degrees\n");
      }

      var gestures: Leap.Gesture[] = frame.gestures();
      for (var i: number = 0; i < gestures.length; i++) {
        var gesture: Leap.Gesture = gestures[i];

        switch (gesture.type) {
          case Leap.Type.TYPE_CIRCLE:
            var circle: Leap.CircleGesture = <Leap.CircleGesture>gesture;

            // Calculate clock direction using the angle between circle normal and pointable
            var clockwiseness: string;
            if (circle.pointable.direction.angleTo(circle.normal) <= Math.PI / 4) {
              // Clockwise if angle is less than 90 degrees
              clockwiseness = "clockwise";
            } else {
              clockwiseness = "counterclockwise";
            }

            // Calculate angle swept since last frame
            var sweptAngle: number = 0;
            if (circle.state != Leap.State.STATE_START) {
              var previousGesture: Leap.Gesture = this.controller.frame(1).gesture(circle.id);
              if (previousGesture.isValid()) {
                var previousUpdate: Leap.CircleGesture = (<Leap.CircleGesture>this.controller.frame(1).gesture(circle.id));
                sweptAngle = (circle.progress - previousUpdate.progress) * 2 * Math.PI;
              }
            }
            console.log("Circle id:" + circle.id + ", " + circle.state + ", progress:" + circle.progress + ", radius:" + circle.radius + ", angle:" + Leap.LeapUtil.toDegrees(sweptAngle) + ", " + clockwiseness);
            break;
          case Leap.Type.TYPE_SWIPE:
            let swipeDirection: string;
            var swipe: Leap.SwipeGesture = <Leap.SwipeGesture>gesture;
            var isHorizontal = Math.abs(swipe.direction[0]) > Math.abs(swipe.direction[1]);
            //Classify as right-left or up-down
            if (isHorizontal) {
              if (swipe.direction[0] > 0) {
                swipeDirection = "right";
              } else {
                swipeDirection = "left";
              }
            } else { //vertical
              if (swipe.direction[1] > 0) {
                swipeDirection = "up";
              } else {
                swipeDirection = "down";
              }
            }
            console.log(swipeDirection)
            // console.log("Swipe id:" + swipe.id + ", " + swipe.state + ", position:" + swipe.position + ", direction:" + swipe.direction + ", speed:" + swipe.speed);
            break;
          case Leap.Type.TYPE_SCREEN_TAP:
            var screenTap: Leap.ScreenTapGesture = <Leap.ScreenTapGesture>gesture;
            console.log("Screen Tap id:" + screenTap.id + ", " + screenTap.state + ", position:" + screenTap.position + ", direction:" + screenTap.direction);
            break;
          case Leap.Type.TYPE_KEY_TAP:
            var keyTap: Leap.KeyTapGesture = <Leap.KeyTapGesture>gesture;
            console.log("Key Tap id:" + keyTap.id + ", " + keyTap.state + ", position:" + keyTap.position + ", direction:" + keyTap.direction);
            break;
        }
      }
    });

  }
}
