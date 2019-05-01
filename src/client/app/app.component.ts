import { Component, OnInit } from '@angular/core';
import { AssistantService } from './services/assistant.service';
import { Cursor } from './Cursor/cursor';
import * as $ from 'jquery';
import { EventsService } from './services/events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  cursor: Cursor;
  constructor(
    private assistant: AssistantService,
    private events: EventsService) {
    /**
     *  togle/hide/display
     */
    this.events.subscribe('menu-display', (data) => {
      if (data.action === 'toggle') {
        this.toggleMenu();
      } else if (data.action === 'hide') {
        this.hideMenu();
      } else if (data.action === 'display') {
        this.displayMenu();
      }
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

  ngOnDestroy() {
    this.events.unsubscribe('menu-display');
  }
}