import { Component, OnInit } from '@angular/core';
import { AssistantService } from '../services/assistant.service';
import * as $ from 'jquery';
import * as just from 'just-animate';
import { Http } from '@angular/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  news: any;
  today = new Date();
  showList: boolean = false;

  constructor(private assistant: AssistantService, private http: Http) {
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
      setInterval(function () { loopLs($eles); }, 9400);
    }

    setTimeout(() => {
      newsTicker($('#news-ticker'));
    });


    // newsTicker($('#news-ticker'));
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

  test() {
    var not = $('#notification')
    $('#notification').show();
    // setTimeout(() => {
    //   $('#notification').hide();
    // }, 37000);
    //FIXME: animate here the pop somehow and remove it from here no use anymore

  }
}
