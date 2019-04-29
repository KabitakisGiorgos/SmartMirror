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
    this.events.subscribe('menu-display', (data) => {
      if (data.action) {
        this.hideMenu();
      }
    });
  }

  ngOnInit() {//TODO:maybe when on demo mode running add  the retrieve news here at initialazation
    this.assistant.assistantInit();
  }


  hideMenu() {
    if ($('.row.footer').css('display') === 'none') {
      $('.row.footer').css('display', 'block');
    } else {
      $('.row.footer').css('display', 'none');
    }
  }

  ngOnDestroy() {
    this.events.unsubscribe('menu-display');
  }
}