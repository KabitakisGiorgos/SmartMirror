import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, stagger, animate, style, state } from '@angular/animations';
import { AssistantService } from '../services/assistant.service';
import { Router } from '@angular/router';

@Component({
  animations: [
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
  selected: object = {
    src: '../../../assets/icons/timeline.png',
    component: 'home'
  };
  menu1: Array<any> = [
    {
      src: '../../../assets/icons/news.png',
      component: 'news'
    },
    {
      src: '../../../assets/icons/media.png',
      component: 'media'
    }
  ];
  menu2: Array<any> = [
    {
      src: '../../../assets/icons/health.png',
      component: 'health'
    },
    {
      src: '../../../assets/icons/calendar.png',
      component: 'calendar'
    }
  ];

  constructor(private assistant: AssistantService,
    private router: Router, ) { }

  ngOnInit() {
  }


  toogleMenu() {
    this.visible = !this.visible;
  }

  navigate(page) {
    let array1 = true;
    let index = this.menu1.findIndex((element) => {
      return element.component === page;
    });

    if (index == -1) {
      array1 = false;
      index = this.menu2.findIndex((element) => {
        return element.component === page;
      });
    }

    if (index == -1) {
      console.log('Dont move');
      return;
    }

    if (array1) {
      let tmp = this.selected;
      this.selected = this.menu1[index];
      this.menu1[index] = tmp;
    } else {
      let tmp = this.selected;
      this.selected = this.menu2[index];
      this.menu2[index] = tmp;
    }

    this.router.navigate(['/' + page + '']);
    this.toogleMenu();
  }
}
