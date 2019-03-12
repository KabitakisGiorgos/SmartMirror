import { Injectable, NgZone } from '@angular/core';
import Artyom from '../../../../node_modules/artyom.js/build/artyom.js';
import { Subject } from "rxjs";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private text: string;
  Jarvis: any;
  subject = new Subject();
  constructor(
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) { }
  assistantInit() {
    this.Jarvis = new Artyom();

    this.Jarvis.initialize({
      lang: 'en-GB',// A lot of languages are supported. Read the docs !
      continuous: true,
      listen: true, // Start recognizing
      debug: true, // Show everything in the console
      speed: 1,// talk normally
      name: 'Jarvis',
      soundex: true
    }).then(() => {
      console.log('Ready to work!');
      this.init();
    })
      .catch(err => {
        console.log(err);
      });
  }

  init() {
    /**
     *  WHEN NO COMMAND IS REACHED
     */
    this.Jarvis.when('NOT_COMMAND_MATCHED', () => {
      this.Jarvis.say('Sorry human i cant understand you');
    });
  }


  navigationCommands() {//Dynamically adding this command
    let commands = {
      description: 'Commands to navigate through the app',
      smart: true,
      indexes: ['Go to *', 'Navigate to *', 'Show me the *', 'Show me *'],//what else could i add ? 
      action: (i, wildcard) => {
        let page = wildcard.replace(/\s+/g, '');
        let pages = [
          'home',
          'menu',
          'calendar',
          'health',
          'media',
          'news',
          'notes',
          'weather'
        ];
        if (pages.includes(page))
          this.ngZone.run(async () => this.router.navigate(['/' + page + '']));
        else this.Jarvis.say('Sorry unknown page');
      }
    }
    this.Jarvis.addCommands(commands);
  }

  carouselNavigationCommands() {
    let commands = [
      {//swipe left/right swipe to left/rigth and to the widgets
        description: 'Commands for navigating to carousel widget',
        smart: true,
        indexes: ['Swipe *', 'Swipe to *'],
        action: (i, wildcard) => {
          let page = wildcard.replace(/\s+/g, '');
          let pages = [
            'calendar',
            'notes',
            'news',
            'waether',
            'health',
            'media',
            'right',
            'left'
          ];
          let tmp = pages.indexOf(page);
          if (tmp != -1) {
            this.subject.next(tmp);
          } else {
            this.Jarvis.say('Sorry unknown slide');
          }
        }
      }
    ]

    this.Jarvis.addCommands(commands);
  }

  testingCommands() {
    /*
    * Test if Jarvis is Hearing
    */
    let commandHello = [
      {
        indexes: ['hello', 'good morning', 'hey'], // These spoken words will trigger the execution of the command
        action: () => { // Action to be executed when a index match with spoken word
          this.Jarvis.say('Hey buddy ! How are you today?');
          // this.  .next('test');//EMit an event of what to do maybe
        }
      },
      {
        indexes: ['test', 'Do you listen'],
        action: () => {
          this.Jarvis.say('I can hear you');
        }
      }
    ];
    this.Jarvis.addCommands(commandHello);
  }

  deleteCommands() {//Dynamically removing commands
    this.Jarvis.emptyCommands();
  }
}
