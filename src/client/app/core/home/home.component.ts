import { Component, OnInit } from '@angular/core';
import { AssistantService } from '../../services/assistant.service';
import { Subscription } from 'rxjs';
import { LeapHandlerService } from '../../services/leap-handler.service';
import { LoggerService } from '../../services/logger.service';
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  subscription: Subscription;
  // constructor(private assistant: AssistantService, private leap: LeapHandlerService)
  constructor(private assistant: AssistantService, private logger: LoggerService) {
    // this.leap.test();
  }

  ngOnInit() {
    this.assistant.navigationCommands();
    this.assistant.testingCommands();
    this.subscription = this.assistant.subject.subscribe((data) => {
      this.logger.log(data, 'Home');
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.assistant.deleteCommands();
  }
}