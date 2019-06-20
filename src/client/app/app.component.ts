import { Component, OnInit } from '@angular/core';
import { AssistantService } from './services/assistant.service';
import { Cursor } from './Cursor/cursor';
import * as $ from 'jquery';
import { EventsService } from './services/events.service';
import { LeapHandlerService } from './services/leap-handler.service';
import { fadeInExpandOnEnterAnimation, slideOutDownOnLeaveAnimation } from 'angular-animations';
import { debugMode } from '../environments/environment';
import config from '../app/services/config.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    fadeInExpandOnEnterAnimation({ anchor: 'enter', duration: 1500 })
  ]
})
export class AppComponent implements OnInit {
  cursor: Cursor;
  screenSaver: boolean = true;
  today = new Date();
  particlesStyles: object = {};
  particlesParams: object = {
    particles: {
      size: {
        value: 30
      },
      number: {
        value: 20
      },
      line_linked: {
        enable: false
      },
      move: {
        speed: 3,
        direction: 'top'
      }
    },
    interactivity: {
      events: {
        onhover: {
          enable: false,
          mode: 'bubble'
        },
        onclick: {
          enable: false,

        }
      }
    }
  };
  clickableElements: Array<string> = ['screensaver'];

  constructor(
    private assistant: AssistantService,
    private events: EventsService,
    private leap: LeapHandlerService,
    private http: HttpClient) {
    setInterval(() => {
      this.today = new Date();
    }, 1000);
    /**
     *  togle/hide/display
     */

    this.leap.registerDivs(this.clickableElements);
    this.events.subscribe('menu-display', (data) => {
      if (data.action === 'toggle') {
        this.toggleMenu();
      } else if (data.action === 'hide') {
        this.hideMenu();
      } else if (data.action === 'display') {
        this.displayMenu();
      }
    });

    this.assistant.subscribe('interaction', (data) => {
      if (data) {
        this.screenSaver = false;
        this.events.publish('state', this.screenSaver);
      }
    });

    this.assistant.subscribe('sleep', () => {
      this.screenSaver = true;
      this.events.publish('state', this.screenSaver);
    });
  }

  async ngOnInit() {
    this.assistant.assistantInit();

    if (!debugMode.app) {
      try {
        // this.retrieveFreshNews();
        setTimeout(() => {
          this.sendNotification('Dont forget to call Papadakis', 'High');
        }, config.demo['1stNotification']);
      } catch (e) {
        console.error(e);
      }
    }
  }


  toggleMenu() {
    if ($('.row.footer').css('display') === 'none') {
      $('.row.footer').css('display', 'block');
    } else {
      $('.row.footer').css('display', 'none');
    }
  }

  hideMenu() {
    $('.row.footer').css('display', 'none');
  }

  displayMenu() {
    $('.row.footer').css('display', 'block');
  }

  open() {
    this.screenSaver = false;
    this.events.publish('state', this.screenSaver);
  }

  ngOnDestroy() {
    this.events.unsubscribe('menu-display');
    this.assistant.unsubscribe('interaction');
    this.leap.unregisterDivs(this.clickableElements);
  }

  retrieveFreshNews() {
    return new Promise((resolve, reject) => {
      this.http.get('/api/news/renew')
        .toPromise()
        .then((data) => {
          if (data) resolve();
          else reject(new Error('Unknown error'));
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  sendNotification(message: string, severity: string) {
    return new Promise((resolve, reject) => {

      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      let body = {
        type: 'Schedule',
        severity: severity,
        text: message
      };

      this.http.post('/api/notifications', body, { headers: headers })
        .toPromise()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}