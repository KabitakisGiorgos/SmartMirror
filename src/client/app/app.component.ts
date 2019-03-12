import { Component, OnInit } from '@angular/core';
import { AssistantService } from './services/assistant.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private assistant: AssistantService) {

  }

  ngOnInit() {
    this.assistant.assistantInit();
  }
}
