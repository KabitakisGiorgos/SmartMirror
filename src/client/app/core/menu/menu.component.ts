import { Component, OnInit, ViewChild } from '@angular/core';
import { slideInUpOnEnterAnimation } from 'angular-animations';
import { AssistantService } from '../../services/assistant.service';
import { Subscription } from 'rxjs';
import carouselComs from '../../../types/types'
import { LeapHandlerService } from '../../services/leap-handler.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    slideInUpOnEnterAnimation({ anchor: 'enter1', duration: 1500 })
  ]
})
export class MenuComponent implements OnInit {
  @ViewChild('slickModal') carousel: any;
  slideConfig: any;
  subscription: Subscription;

  constructor(private assistant: AssistantService, private leap: LeapHandlerService) {
    this.slideConfig = {
      slidesToShow: 2,
      slidesToScroll: 2,
      useTransform: false//TODO: dont change it is for flickering
    };
  }

  ngOnInit() {
    this.assistant.navigationCommands();
    this.assistant.carouselNavigationCommands();
    this.subscription = this.assistant.subject.subscribe((data: number) => {
      if (data === carouselComs.Next)
        this.next();
      else if (data === carouselComs.Previous)
        this.previous();
      else {
        this.goTo(data);
      }
    });
  }

  next() {
    this.carousel.slickNext();
  }

  previous() {
    this.carousel.slickPrev();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.assistant.deleteCommands();
  }

  goTo(id: number) {
    this.carousel.slickPrev();
  }
}
