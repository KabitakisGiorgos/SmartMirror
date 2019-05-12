import { Component, OnInit, ViewChild } from '@angular/core';
import { AssistantService } from '../../services/assistant.service';
import { Subscription } from 'rxjs';
import { LeapHandlerService } from '../../services/leap-handler.service';
import { LoggerService } from '../../services/logger.service';
import { Http } from '@angular/http';
import { slideInUpOnEnterAnimation } from 'angular-animations';
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    slideInUpOnEnterAnimation({ anchor: 'enter', duration: 1200 })
  ]
})
export class HomeComponent implements OnInit {
  subscription: Subscription;
  events: any;
  selectedEvent: number;
  clickableElements: Array<string> = [];
  @ViewChild('slickModal') carousel: any;
  slides = [
    {
      img: '../../../assets/images/homeWidgets/Hypnos.png',
      class: 'hypnos'
    },
    {
      img: '../../../assets/images/homeWidgets/Traffic.png',
      class: 'commute'
    },
    {
      img: '../../../assets/images/homeWidgets/Work.png',
      class: 'work'
    },
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
    infinite: false,
    variableWidth: true
  };

  constructor(
    private assistant: AssistantService,
    private logger: LoggerService,
    private leap: LeapHandlerService,
    private http: Http
  ) {
  }

  async ngOnInit() {
    this.assistant.navigationCommands();
    this.assistant.testingCommands();
    this.subscription = this.assistant.subject.subscribe((data) => {
      this.logger.log(data, 'Home');
    });
    try {
      this.events = await this.retrieveEvents();
      this.selectedEvent = 0;
      for (let i = 0; i < this.events.length; i++) {
        this.clickableElements.push(this.events[i]._id);
      }
      this.leap.registerDivs(this.clickableElements);
    } catch (e) {
      console.error(e);
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.assistant.deleteCommands();
    this.leap.unregisterDivs(this.clickableElements);
  }


  retrieveEvents() {
    return new Promise((resolve, reject) => {
      var url = '/api/events';
      this.http.get(url)
        .toPromise()
        .then((reponse: any) => {
          resolve(JSON.parse(reponse._body))
        })
        .catch(err => {
          reject(err);
        });
    })
  }

  setPosition(event) {
    let dayStart = 21600000;
    let dayEnd = 86400000;
    let percentage = (event.start - dayStart) / (dayEnd - dayStart);
    percentage = (percentage * 100) - 1;

    return percentage + '%';
  }

  setEventWidth(event) {
    let dayStart = 21600000;
    let dayEnd = 86400000;
    let percentage = (event.end - event.start) / (dayEnd - dayStart);
    percentage = percentage * 100;
    return percentage + '%';
  }

  select(slide) {
    this.carousel.slickGoTo(slide);
    this.selectedEvent = slide;
  }

  nextEvent() {//TODO: will be used from Jarvis
    this.carousel.slickNext();
  }

  prevEvent() {
    this.carousel.slickPrev();
  }
}


/**
 * Convert the ms to hour
 * var moment =require('moment')


var x = 23400000;
var tempTime = moment.duration(x);

console.log(tempTime.hours()+':'+tempTime.minutes());
 */