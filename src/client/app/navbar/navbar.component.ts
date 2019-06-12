import { Component } from '@angular/core';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import config from '../services/config.json';
import { EventsService } from '../services/events.service';
import { slideInDownOnEnterAnimation } from 'angular-animations';
import Typed from 'typed.js';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    slideInDownOnEnterAnimation({ anchor: 'enter', duration: 800 })
  ]
})
export class NavbarComponent {
  news: Array<any> = [];
  today = new Date();
  show: boolean = true;

  constructor(
    private http: Http,
    private events: EventsService) {
    this.events.subscribe('navbar-display', (data) => {
      if (data.action === 'toggle') {
        this.toggleNavbar();
      } else if (data.action === 'hide') {
        this.hideNavbar();
      } else if (data.action === 'display') {
        this.displayNavbar();
      }
    });

    setInterval(() => {
      this.today = new Date();
    }, 1000);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.retrieveNews().then((data: Array<any>) => {
      for (let i = 0; i < data.length; i++) {
        this.news.push(data[i].title);
      }

      var types = new Typed('#news-ticker', {
        strings: this.news,
        loopCount: Infinity,
        backDelay: 5000,
        typeSpeed: 70,
        showCursor: false,
        fadeOut: true,
        loop: true
      });
    });
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

  toggleNavbar() {
    if (this.show) {
      this.show = !this.show;
      $("#navbar").slideUp(() => {
        //Just to remember you can pass callback
      });
    }
    else {
      $("#navbar").slideDown();
      this.show = !this.show;
    }
  }

  displayNavbar() {
    this.show = true;
    $("#navbar").slideDown();
  }

  hideNavbar() {
    this.show = false;
    $("#navbar").slideUp();
  }

  ngOnDestroy() {
    this.events.unsubscribe('navbar');
  }
}
