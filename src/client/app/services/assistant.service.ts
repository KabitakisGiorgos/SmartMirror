import { Injectable } from '@angular/core';
import Artyom from '../../../../node_modules/artyom.js/build/artyom.js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  Jarvis: any;
  private subject = new BehaviorSubject({});
  subjectitem = this.subject.asObservable();
  constructor() {

  }

  assistantInit() {
    this.Jarvis = new Artyom();

    this.Jarvis.initialize({
      lang: 'en-GB',// A lot of languages are supported. Read the docs !
      continuous: true,
      listen: true, // Start recognizing
      debug: true, // Show everything in the console
      speed: 1,// talk normally

      name: 'Jarvis'
    }).then(() => {
      console.log('Ready to work!');
      this.init();
    })
      .catch(err => {
        console.log(err);
      });;
  }

  test() {
    this.Jarvis.say('Hey buddy ! How are you today?');
  }

  init() {
    let commandHello = {
      indexes: ['hello', 'good morning', 'hey'], // These spoken words will trigger the execution of the command
      action: () => { // Action to be executed when a index match with spoken word
        this.Jarvis.say('Hey buddy ! How are you today?');
        this.subject.next('test');
      }
    };
    this.Jarvis.addCommands(commandHello);
    // this.Jarvis.say('Hello');
  }
}
