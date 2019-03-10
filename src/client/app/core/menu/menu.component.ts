import { Component, OnInit, ViewChild } from '@angular/core';
import { slideInUpOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    slideInUpOnEnterAnimation({ anchor: 'enter1', duration: 1500 })
  ]
})
export class MenuComponent implements OnInit {
  @ViewChild('slickModal') carousel: any;
  slides: any[] = [];
  slideConfig: any;

  constructor() {
    this.slideConfig = {
      slidesToShow: 2,
      slidesToScroll: 2,
      useTransform: false//TODO: dont change it is for flickering
    };
  }

  ngOnInit() {

  }

  next() {
    this.carousel.slickNext();
  }

  previous() {
    this.carousel.slickPrev();
  }
}
