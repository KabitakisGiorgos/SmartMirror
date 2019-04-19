import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  @ViewChild('slickModal') carousel: any;
  slides = [
    { img: '../../../assets/images/rock.png' },
    { img: '../../../assets/images/motivation.png' },
    { img: '../../../assets/images/sleep.png ' },
    { img: '../../../assets/images/party.png' },
    { img: '../../../assets/images/80.png' },
    { img: '../../../assets/images/romance.png' },
    { img: '../../../assets/images/hiphop.png' },
    { img: '../../../assets/images/kids.png' },
    { img: '../../../assets/images/classical.png' }
  ];

  favorites = [
    {
      title: 'Post Malone - rockstar ft. 21 Savage',
      image: '../../../assets/images/post.png',
      repeats: '12',
      duration: '4:01',
    },
    {
      title: 'Iron Maiden - Alexander The Great',
      image: '../../../assets/images/alexander.png',
      repeats: '22',
      duration: '8:34',
    },
    {
      title: 'Iron maiden - the legacy',
      image: '../../../assets/images/legacy.png',
      repeats: '11',
      duration: '9:23',
    },
    {
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    }
  ];
  slideConfig = {
    slidesToShow: 6,
    slidesToScroll: 6,
    arrows: false,
    infinite: false,
  };
  constructor() { }

  ngOnInit() {

  }

  next() {
    this.carousel.slickNext();
  }

  previous() {
    this.carousel.slickPrev();
  }

}
