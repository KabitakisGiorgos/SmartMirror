import { Component } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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
      'slidesToShow': 2,
      'slidesToScroll': 2,
      'accessibility': true,
      'useTransform': false//TODO: dont change it is for flickering
    };
  }

  addSlide() {
    this.slides.push({ img: 'http://placehold.it/350x150/777777' })
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }
}
