import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('slickModal') carousel: any;
  slides = [
    { img: 'https://via.placeholder.com/150' },
    { img: 'https://via.placeholder.com/150' },
    { img: 'https://via.placeholder.com/150' },
    { img: 'https://via.placeholder.com/150' },
    { img: 'https://via.placeholder.com/150' },
    { img: 'https://via.placeholder.com/150' },
    { img: 'https://via.placeholder.com/150' },
    { img: 'https://via.placeholder.com/150' },
    { img: 'https://via.placeholder.com/150' }
  ];

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    infinite: false
  };

  constructor(
    private assistant: AssistantService,
    private logger: LoggerService,
    private leap: LeapHandlerService,
    private router: Router) {
  }

  ngOnInit() {
    // this.leap.registerDivs(['news', 'health', 'schedule']);
    this.assistant.navigationCommands();
    this.assistant.testingCommands();
    this.subscription = this.assistant.subject.subscribe((data) => {
      this.logger.log(data, 'Home');
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.assistant.deleteCommands();
    // this.leap.unregisterDivs(['news', 'health', 'schedule']);
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