import { Component, OnInit } from '@angular/core';
import { slideInUpOnEnterAnimation } from 'angular-animations';
import { Http } from '@angular/http';
import { EventsService } from '../../services/events.service';

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

  constructor(
    private http: Http,
    private events: EventsService
  ) {
    this.retrieveNews().then((data) => {
      this.news = data;
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

}
