import { Component, OnInit } from '@angular/core';
import { AssistantService } from '../../services/assistant.service';
import { Subscription } from 'rxjs';
import { LeapHandlerService } from '../../services/leap-handler.service';
import { LoggerService } from '../../services/logger.service';
import { Router } from '@angular/router';
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  subscription: Subscription;

  constructor(
    private assistant: AssistantService,
    private logger: LoggerService,
    private leap: LeapHandlerService,
    private router: Router) {
    // this.leap.init();//FIXME: to have a debug in order to use the mouse
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

  go2Calendar() {
    this.router.navigate(['/calendar']);
  }

  go2news() {
    this.router.navigate(['/calendar']);
  }

  go2Health() {

  }
}