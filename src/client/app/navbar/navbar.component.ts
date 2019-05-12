import { Component } from '@angular/core';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import config from '../services/config.json';
import { EventsService } from '../services/events.service';
import { slideInDownOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    slideInDownOnEnterAnimation({ anchor: 'enter', duration: 800 })
  ]
})
export class NavbarComponent {
  news: any;
  today = new Date();
  show: boolean = true;

  constructor(
    private http: Http,
    private events: EventsService) {
    this.retrieveNews().then((data) => {
      this.news = data;
    });
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
    function newsTicker($ele) {
      var $eles = $ele.find('ul > li'),
        $current = $eles.hide().first(),
        rotateCharsTimer;

      function rotateChars($ele) {
        var indexCut = 0;
        var title = $ele.data('title');
        rotateCharsTimer = setInterval(function () {
          if ($ele.text().length >= title.length) {
            clearInterval(rotateCharsTimer);
          } else {
            $ele.text(title.substr(0, indexCut++));
          }
        }, 90);
      }

      function loopLs($eles) {
        if (typeof rotateCharsTimer != 'undefined') {
          clearInterval(rotateCharsTimer);
        }
        $current.find('span').fadeOut('slow', function () {
          $eles.hide();
          $current = $current.next().length ? $current.next()
            : $eles.first();
          rotateChars($current.show()
            .find('span')
            .text('')
            .fadeIn());
        });
      }

      $eles.find('span').each(function () {
        $(this).data('title', $(this).text());
      });
      loopLs($eles);
      setInterval(function () { loopLs($eles); }, config.news.changeDelay);
    }

    setTimeout(() => {
      newsTicker($('#news-ticker'));
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
