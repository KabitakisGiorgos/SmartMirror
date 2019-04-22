import { Component } from '@angular/core';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import config from '../services/config.json';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  news: any;
  today = new Date();
  show: boolean = true;

  constructor(private http: Http) {
    setInterval(() => {
      this.today = new Date();
    }, 1000);
  }

  ngOnInit() {
    this.retrieveNews().then((data) => {
      this.news = data;
    });
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
    },150);
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

  hide() {
    if (this.show) {
      this.show = !this.show;
      $("#navbar").slideUp(() => {
        setTimeout(() => {//Just for debbuging
          $("#navbar").slideDown();
        }, 2000);
      });
    }
    else {
      $("#navbar").slideDown();
      this.show = !this.show;
    }
  }
}
