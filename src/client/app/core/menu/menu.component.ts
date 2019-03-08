import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @ViewChild('slickModal') carousel: any;
  slides: any[] = [];
  slideConfig: any;

  constructor() {
    this.slides = [
      {
        title: 'http://placehold.it/350x150/000000',
        name: 'test1'
      },
      {
        title: 'http://placehold.it/350x150/111111',
        name: 'test2'
      },
      {
        title: 'http://placehold.it/350x150/333333',
        name: 'test3'
      },
      {
        title: 'http://placehold.it/350x150/666666',
        name: 'test4'
      }
    ];
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
