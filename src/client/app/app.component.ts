import { Component, OnInit } from '@angular/core';
import { AssistantService } from './services/assistant.service';
import { Cursor } from './Cursor/cursor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  cursor: Cursor;
  constructor(private assistant: AssistantService) { }

  ngOnInit() {//TODO:maybe when on demo mode running add  the retrieve news here at initialazation
    this.assistant.assistantInit();
  }
}