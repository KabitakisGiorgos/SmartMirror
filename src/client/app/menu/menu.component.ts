import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { AssistantService } from '../services/assistant.service';
import { Router } from '@angular/router';
import { LeapHandlerService } from '../services/leap-handler.service';
import { slideInUpOnEnterAnimation } from 'angular-animations';
import { EventsService } from '../services/events.service';

@Component({
  animations: [
    slideInUpOnEnterAnimation({ anchor: 'enter', duration: 800 }),
    trigger('openClose', [
      state('open', style({
        bottom: '360px'
      })),
      state('closed', style({
        bottom: '55px'
      })),
      transition('open => closed', [
        animate('0.75s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  visible: boolean = false;
  menu: Array<any> = [
    {
      src: '../../../assets/icons/news.png',
      component: 'news'
    },
    {
      src: '../../../assets/icons/media.png',
      component: 'media'
    },
    {
      src: '../../../assets/icons/timeline.png',
      component: 'home'
    },
    {
      src: '../../../assets/icons/health.png',
      component: 'health'
    },
    {
      src: '../../../assets/icons/calendar.png',
      component: 'calendar'
    }
  ];
  clickableElements: Array<string> = ['menu', 'menu-home', 'menu-health', 'menu-news', 'menu-calendar', 'menu-media'];
  animatingElements: Array<string> = ['menu-home', 'menu-health', 'menu-news', 'menu-calendar', 'menu-media'];
  constructor(
    private assistant: AssistantService,
    private router: Router,
    private leap: LeapHandlerService,
    private events: EventsService) {
    this.leap.registerDivs(this.clickableElements);
    this.leap.registerAnimatingDivs(this.animatingElements);//Clickable are also animating
    this.assistant.subscribe('navigate', (data) => {
      this.navigate(data.page);
    });
    this.events.subscribe('animate', (data) => {
      if (this.animatingElements.includes(data.element)) {
        this.animateCSS(data.element, 'pulse');
      }
    });
  }

  ngOnInit() {
  }


  toogleMenu() {
    this.visible = !this.visible;
  }

  navigate(page) {

    let index = this.menu.findIndex((element) => {
      return element.component === page;
    });

    if (index != -1 && index != 2) {
      let shift = 2 - index;
      this.menu = this.insertAndShift(this.menu, shift);
      this.router.navigate(['/' + page + '']);
    }
    this.toogleMenu();
  }

  ngOnDestroy() {
    this.leap.unregisterDivs(this.clickableElements);
    this.leap.unregisterAnimatingDivs(this.animatingElements);
    this.events.unsubscribe('animate');
    this.assistant.unsubscribe('navigate');
  }

  /**
   * Helper Function 
   * @param arr array for input
   * @param move how to
   */
  insertAndShift(arr, move) {
    var newarray = [0, 0, 0, 0, 0];
    if (move < 0) move = arr.length + move;
    for (let i = 0; i < arr.length; i++) {
      if (i + move > 4) {
        let tmpmove = i + move - arr.length;
        newarray[tmpmove] = arr[i];
      } else {
        newarray[i + move] = arr[i];
      }

    }
    return newarray;
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
