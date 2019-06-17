import { Component, OnInit } from '@angular/core';
import { AssistantService } from './services/assistant.service';
import { Cursor } from './Cursor/cursor';
import * as $ from 'jquery';
import { EventsService } from './services/events.service';
import { LeapHandlerService } from './services/leap-handler.service';
import { fadeInExpandOnEnterAnimation, slideOutDownOnLeaveAnimation } from 'angular-animations';

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
    private leap: LeapHandlerService) {
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

  ngOnInit() {//TODO:maybe when on demo mode running add  the retrieve news here at initialazation
    this.assistant.assistantInit();
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
}