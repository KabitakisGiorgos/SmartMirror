import { Injectable, NgZone } from '@angular/core';
import Artyom from '../../../../node_modules/artyom.js/build/artyom.js';
import { Router } from '@angular/router';
import { debugMode } from '../../environments/environment';
import { LoggerService } from './logger.service.js';
export type EventHandler = (...args: any[]) => any;

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private isListening: boolean;
  private Jarvis: any;
  private debug: boolean;
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private logger: LoggerService,
  ) {
    this.debug = debugMode['Jarvis'];
  }
  //FIXME: shut up command
  private c = new Map<string, EventHandler[]>();
  subscribe(topic: string, ...handlers: EventHandler[]) {
    let topics = this.c.get(topic);
    if (!topics) {
      this.c.set(topic, topics = []);
    }
    topics.push(...handlers);
  }

  unsubscribe(topic: string, handler?: EventHandler): boolean {
    if (!handler) {
      return this.c.delete(topic);
    }

    const topics = this.c.get(topic);
    if (!topics) {
      return false;
    }

    // We need to find and remove a specific handler
    const index = topics.indexOf(handler);

    if (index < 0) {
      // Wasn't found, wasn't removed
      return false;
    }
    topics.splice(index, 1);
    if (topics.length === 0) {
      this.c.delete(topic);
    }
    return true;
  }

  private publish(topic: string, ...args: any[]): any[] | null {
    const topics = this.c.get(topic);
    if (!topics) {
      return null;
    }
    return topics.map(handler => {
      try {
        return handler(...args);
      } catch (e) {
        console.error(e);
        return null;
      }
    });
  }


  assistantInit() {
    this.Jarvis = new Artyom();
    this.Jarvis.initialize({
      soundex: true,
      lang: 'en-GB',// A lot of languages are supported. Read the docs !
      continuous: true,
      listen: true, // Start recognizing
      debug: this.debug, // Show everything in the console
      speed: 1,// talk normally
      name: 'Jarvis',
     
    }).then(() => {
      this.logger.log('Ready to work', 'AssistantService');
      this.isListening = true;
      this.init();
    }).catch(err => {
      this.isListening = false;
      this.logger.error(err);
    });
  }

  init() {
    /**
     *  WHEN NO COMMAND IS REACHED
     */
    this.Jarvis.when('NOT_COMMAND_MATCHED', () => {
      this.Jarvis.say('Sorry human i cant understand you');
    });
    this.navigationCommands();
    this.testingCommands();
    this.playSongs();
    this.NewsSearch();
    this.mediaPlayerControlling();
  }


  navigationCommands() {
    let commands = {
      description: 'Commands to navigate through the app',
      smart: true,
      indexes: ['Go to *', 'Navigate to *', 'Show me the *', 'Show me *'],//what else could i add ? 
      action: (i, wildcard) => {
        this.publish('interaction', true);
        let page = wildcard.replace(/\s+/g, '');
        let pages = [
          'home',
          'calendar',
          'health',
          'media',
          'news',
        ];
        if (pages.includes(page))
          this.publish('navigate', { page: page });
        else this.Jarvis.say('Sorry unknown page');
      }
    }
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
          this.publish('interaction', true);
          // this.  .next('test');//EMit an event of what to do maybe
        }
      },
      {
        indexes: ['test', 'Do you listen'],
        action: () => {
          this.Jarvis.say('I can hear you');
          this.publish('interaction', true);
        }
      }
    ];
    this.Jarvis.addCommands(commandHello);
  }

  NewsSearch() {
    let searchNews = {
      smart: true,
      indexes: ['Find news about *', 'What about *', 'Search for *'],
      action: (i, wildcard) => {
        console.log(this.router.url);

        let index = wildcard.indexOf(' ');
        let topic = wildcard.slice(0, index) + wildcard.slice(index + ' '.length);
        if (this.router.url === '/news') {
          this.Jarvis.say('Searching for ' + topic);
          this.publish('search', { topic: topic });
        } else this.Jarvis.say('Sorry cant help you, you must go to news');

      }
    };
    this.Jarvis.addCommands(searchNews);
  }

  playSongs() {
    let songs = ['rockstar', 'the vengful one', 'dream no more', 'sad but true', 'lex', 'the greatest motivational speech ever'];
    let command = {
      smart: true,
      indexes: ['Play *', 'I want to hear *'],//what else could i add ? 
      action: (i, wildcard) => {
        let index = wildcard.indexOf(' ');
        let song = wildcard.slice(0, index) + wildcard.slice(index + ' '.length);
        console.log(this.router.url);
        index = this.router.url.indexOf(';');
        let url = this.router.url.slice(0, index);
        console.log(url);

        if (url !== '/media' && url !== '/media/player') {
          this.Jarvis.say('Sorry cant help you, you must go to media or player');
          return;
        }
        if (songs.includes(song)) this.publish('song', song);
        else this.Jarvis.say('Sorry unknown song');
      }
    }
    this.Jarvis.addCommands(command);
  }

  mediaPlayerControlling() {
    let command = {//Cant understand :Previous
      indexes: ['Next', 'Previews', 'Play', 'Pause'],//FIXME:Seek time too maybe and volume
      action: (i) => {
        let index = this.router.url.indexOf(';');
        let url = this.router.url.slice(0, index);
        if (url !== '/media/player') {
          this.Jarvis.say('What are you refering to human');
          return;
        } else {
          this.publish('mediaControlls', i);
        }
      }
    }
    this.Jarvis.addCommands(command);
  }

  deleteCommands() {//Dynamically removing commands
    this.Jarvis.emptyCommands();
  }

  say(string) {
    this.Jarvis.say(string);
  }

  IsListening() {
    return this.isListening;
  }
}
