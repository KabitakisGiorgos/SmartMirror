import { Component, OnInit, ViewChild } from '@angular/core';
import { AssistantService } from '../../services/assistant.service';
import { LeapHandlerService } from '../../services/leap-handler.service';
import { LoggerService } from '../../services/logger.service';
import { Http } from '@angular/http';
import { slideInUpOnEnterAnimation } from 'angular-animations';
import { EventsService } from '../../services/events.service';
import * as _ from 'lodash';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    slideInUpOnEnterAnimation({ anchor: 'enter', duration: 1000 })
  ]
})
export class HomeComponent implements OnInit {
  events: any;
  selectedEvent: number;
  clickableElements: Array<string> = [];
  animatingElements: Array<string> = [];
  @ViewChild('slickModal') carousel: any;
  slides = [
    {
      img: '/assets/images/homeWidgets/Hypnos.png',
      class: 'hypnos'
    },
    {
      img: '/assets/images/homeWidgets/breakfast.png',
      class: 'hypnos'
    },
    {
      img: '/assets/images/homeWidgets/Traffic.png',
      class: 'commute'
    },
    {
      img: '/assets/images/homeWidgets/Work.png',
      class: 'work'
    },
    {
      img: '/assets/images/homeWidgets/Traffic2.png',
      class: 'commute'
    },
    {
      img: '/assets/images/homeWidgets/relax.png',
      class: 'hypnos'
    },
    {
      img: '/assets/images/homeWidgets/dinner.png',
      class: 'hypnos'
    }
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    infinite: false,
    variableWidth: true
  };

  constructor(
    private assistant: AssistantService,
    private logger: LoggerService,
    private leap: LeapHandlerService,
    private http: Http,
    private Events: EventsService
  ) {
  }

  async ngOnInit() {
    try {
      this.events = await this.retrieveEvents();
      this.events = _.sortBy(this.events, ['start']);
      this.selectedEvent = 0;
      for (let i = 0; i < this.events.length; i++) {
        this.clickableElements.push(this.events[i]._id);
        this.animatingElements.push(this.events[i]._id);
      }
      this.leap.registerDivs(this.clickableElements);
      this.leap.registerAnimatingDivs(this.animatingElements);
      this.Events.subscribe('animate', (data) => {
        if (this.animatingElements.includes(data.element))
          this.animateCSS(data.element, 'menu');
      });
    } catch (e) {
      console.error(e);
    }

  }

  ngOnDestroy() {
    this.leap.unregisterDivs(this.clickableElements);
    this.leap.unregisterAnimatingDivs(this.animatingElements);
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

  select(slide, id) {
    this.carousel.slickGoTo(slide);
    this.selectedEvent = slide;
  }

  nextEvent() {//TODO: will be used from Jarvis
    this.carousel.slickNext();
  }

  prevEvent() {
    this.carousel.slickPrev();
  }

  animateCSS(element, animationName, callback?) {
    const node = document.getElementById(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
      node.classList.remove('animated', animationName)
      node.removeEventListener('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback()
    }
    node.addEventListener('animationend', handleAnimationEnd)
  }
}


/**
 * Convert the ms to hour
 * var moment =require('moment')


var x = 23400000;
var tempTime = moment.duration(x);

console.log(tempTime.hours()+':'+tempTime.minutes());
 */