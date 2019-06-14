import { Component, OnInit, ViewChild } from '@angular/core';
import { slideInUpOnEnterAnimation } from 'angular-animations';
import { Http } from '@angular/http';
import { EventsService } from '../../services/events.service';
import { LeapHandlerService } from '../../services/leap-handler.service';
import { AssistantService } from '../../services/assistant.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';
import * as _ from 'lodash';

@Component({
  animations: [
    slideInUpOnEnterAnimation({ anchor: 'enter', duration: 1000 }),
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ])
    ])
  ],
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  news: any;
  clickableElements: Array<string> = [];
  @ViewChild('slickModal') carousel: any;
  modalTitle: string;
  timeoutHandler: any;
  modalOpen: boolean = false;
  autocueOpen: boolean = false;
  autocueArticles: Array<any> = [];

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
      this.leap.registerAnimatingDivs(['uplist', 'downlist']);
      this.leap.registerDivs(['uplist', 'downlist', 'autocue', 'autocueModal', 'searchModal']);
    });

    this.assistant.subscribe('search', (data) => {
      this.modalTitle = data.topic;
      this.searchNews(data.topic)
        .then((news: []) => {
          if (news.length > 0) {
            this.openModal();
            this.autocueArticles = news;
          } else this.assistant.say('Could not retrieve any news');
        })
        .catch((err) => {
          console.error(err);
          this.assistant.say('Something went really wrong');
        });
    });

    this.assistant.subscribe('autocue', (i) => {
      if (i === 'Stop') {
        this.autocueModalClose();
        this.closeModal();
      } else if (i === 'Pause') {
        //FIXME:
      } else if (i === 'Start') {
        this.autocueStart();
      }
      else {
        this.assistant.say('Ooops George messed up');
      }
    });

    this.Events.subscribe('animate', (data) => {
      if (this.clickableElements.includes(data.element)) {//A way to animate the inside of the clickable element
        this.animateCSS('Image' + data.element, 'pulse');
      } else if (data.element === 'uplist') {
        this.up();//Added up and down button to animate in order to add custom handlers
      } else if (data.element === 'downlist') {
        this.down();
      }
    });
  }

  ngAfterViewInit() {
    this.ngxSmartModalService.getModal('searchModal').onOpen.subscribe(() => {
      this.modalOpen = true;
    });

    this.ngxSmartModalService.getModal('searchModal').onClose.subscribe(() => {
      this.modalOpen = false;
      this.autocueArticles = [];
      this.assistant.shutUp();
    });

    this.ngxSmartModalService.getModal('autocueModal').onOpen.subscribe(() => {
      this.autocueOpen = true;
    });

    this.ngxSmartModalService.getModal('autocueModal').onClose.subscribe(() => {
      this.autocueArticles = [];
      this.autocueOpen = false;
      this.assistant.shutUp();
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
    let list = this.modalOpen ? 'modallist' : 'newslist';
    if (!this.timeoutHandler) {
      $('#downlist').addClass('active');//TODO: test with leap
      this.timeoutHandler = setInterval(() => {
        if (!this.leap.getSelectedElem()) {
          this.mouseleave();
          return;
        }

        var elmnt = document.getElementById(list);
        var y = elmnt.scrollTop;
        elmnt.scroll({
          left: 0,
          top: y + 80,
          behavior: 'smooth'
        });
      }, 100);
    }
  }

  mouseleave() {
    if (this.timeoutHandler) {
      $('#uplist').removeClass('active');
      $('#downlist').removeClass('active');
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  up() {
    let list = this.modalOpen ? 'modallist' : 'newslist';
    if (!this.timeoutHandler) {
      $('#uplist').addClass('active');//The button
      this.timeoutHandler = setInterval(() => {
        if (!this.leap.getSelectedElem()) {
          this.mouseleave();
          return;
        }

        var elmnt = document.getElementById(list);
        var y = elmnt.scrollTop;
        elmnt.scroll({
          left: 0,
          top: y - 80,
          behavior: 'smooth'
        });
      }, 100);
    }
  }

  ngOnDestroy() {
    this.leap.unregisterDivs(this.clickableElements);
    this.leap.unregisterAnimatingDivs(this.clickableElements);
    this.leap.unregisterAnimatingDivs(['uplist', 'downlist']);
    this.leap.unregisterDivs(['uplist', 'downlist', 'autocue', 'autocueModal', 'searchModal']);
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

  openModal() {
    this.ngxSmartModalService.getModal('searchModal').open();
  }

  closeModal() {
    this.ngxSmartModalService.getModal('searchModal').close();
  }

  autocueStart() {
    if (!this.autocueOpen && !this.modalOpen) {
      this.ngxSmartModalService.getModal('autocueModal').open();
      this.readAutocue(0, this.news);
    } else if (this.modalOpen) {
      let tmp = [];
      tmp = _.cloneDeep(this.autocueArticles);
      this.autocueArticles = [];
      this.readAutocue(0, tmp);
    } else {
      //TODO: pause or stop
    }
  }

  autocueModalClose() {
    this.ngxSmartModalService.getModal('autocueModal').close();
  }

  autocuePause() {

  }

  //a function to pause autocue

  readAutocue(i, array) {
    if (i < array.length) {
      this.autocueArticles.unshift(array[i]);
      if (array[i].title)
        this.assistant.say(array[i].title);

      if (array[i].description)
        this.assistant.say(array[i].description, () => {
          this.readAutocue(i + 1, array);
        });
      else this.readAutocue(i + 1, array);
    }
  }
}