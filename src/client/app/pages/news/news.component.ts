import { Component, OnInit } from '@angular/core';
import { slideInUpOnEnterAnimation } from 'angular-animations';
import { Http } from '@angular/http';
import { EventsService } from '../../services/events.service';
import * as $ from 'jquery';
import { LeapHandlerService } from '../../services/leap-handler.service';

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

  constructor(
    private http: Http,
    private events: EventsService,
    private leap: LeapHandlerService,
    private Events: EventsService
  ) {
    this.retrieveNews().then((data: Array<any>) => {
      this.news = data;
      for (let i = 0; i < data.length; i++) {
        this.clickableElements.push('news' + data[i]._id);
      }
      this.leap.registerDivs(this.clickableElements);
      this.leap.registerAnimatingDivs(this.clickableElements);
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
}
