import { Component, OnInit, ViewChild } from '@angular/core';
import { slideInUpOnEnterAnimation } from 'angular-animations';
import { Http } from '@angular/http';
import { EventsService } from '../../services/events.service';
import * as $ from 'jquery';
import { LeapHandlerService } from '../../services/leap-handler.service';
import { AssistantService } from '../../services/assistant.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  animations: [
    slideInUpOnEnterAnimation({ anchor: 'enter', duration: 1000 })
  ],
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  news: any;
  clickableElements: Array<string> = [];
  @ViewChild('slickModal') carousel: any;
  modalTitle: string;
  retrieved: any;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,//TODO: Create problem to the click of the leap
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
  };

  constructor(
    private http: Http,
    private events: EventsService,
    private leap: LeapHandlerService,
    private Events: EventsService,
    private assistant: AssistantService,
    public ngxSmartModalService: NgxSmartModalService,
  ) {
    this.retrieveNews().then((data: Array<any>) => {
      this.news = data;
      for (let i = 0; i < data.length; i++) {
        this.clickableElements.push('news' + data[i]._id);
        this.clickableElements.push('Slidenews' + data[i]._id);
      }
      this.leap.registerDivs(this.clickableElements);
      this.leap.registerAnimatingDivs(this.clickableElements);
    });

    this.assistant.subscribe('search', (data) => {
      this.modalTitle = data.topic;
      this.searchNews(data.topic)
        .then((news: []) => {
          if (news.length > 0) {
            this.openModal();
            this.retrieved = news;
          } else this.assistant.say('Could not retrieve any news');
        })
        .catch((err) => {
          console.error(err);
          this.assistant.say('Something went really wrong');
        });
    });

    this.Events.subscribe('animate', (data) => {
      if (this.clickableElements.includes(data.element)) {//A way to animate the inside of the clickable element
        this.animateCSS('Image' + data.element, 'pulse');
      }
    });

  }

  ngOnInit() {
  }

  retrieveNews() {
    return new Promise((resolve, reject) => {
      var url = '/api/news';
      this.http.get(url)
        .toPromise()
        .then((response: any) => {
          let news = JSON.parse(response._body);
          resolve(news);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  searchNews(topic) {
    return new Promise((resolve, reject) => {
      var url = '/api/news/retrieve?topic=' + topic;
      this.http.get(url)
        .toPromise()
        .then((response: any) => {
          let news = JSON.parse(response._body);
          resolve(news);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  down() {
    var elmnt = document.getElementById('newslist');
    var y = elmnt.scrollTop;
    elmnt.scroll(0, y + 335);
  }

  up() {
    var elmnt = document.getElementById('newslist');
    var y = elmnt.scrollTop;
    elmnt.scroll(0, y - 335);
  }

  ngOnDestroy() {
    this.leap.unregisterDivs(this.clickableElements);
    this.leap.unregisterAnimatingDivs(this.clickableElements);
  }

  animateCSS(element, animationName, callback?) {//TODO:  this works with animateCSS Helper function placeholder here
    const node = document.getElementById(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
      node.classList.remove('animated', animationName)
      node.removeEventListener('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback()
    }
    node.addEventListener('animationend', handleAnimationEnd)
  }
  // <!-- TODO: Placeholder for leap 
  next() {
    this.carousel.slickNext();
  }

  previous() {
    this.carousel.slickPrev();
  }

  openModal() {
    this.ngxSmartModalService.getModal('searchModal').open();
  }

  closeModal() {
    this.ngxSmartModalService.getModal('searchModal').close();
  }
}
