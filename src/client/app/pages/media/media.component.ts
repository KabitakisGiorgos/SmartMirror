import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { slideInUpOnEnterAnimation } from 'angular-animations';
import * as $ from 'jquery';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  animations: [
    slideInUpOnEnterAnimation({ anchor: 'enter', duration: 1500 })
  ]
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

  favorites = [//FIXME: these prolly need transfer and not being hard coded
    {
      id: 1,
      title: 'Post Malone - rockstar ft. 21 Savage',
      image: '../../../assets/images/post.png',
      repeats: '12',
      duration: '4:01',
      url: '../../../assets/video/postmalone.mp4'
    },
    {
      id: 2,
      title: 'Iron Maiden - Alexander The Great',
      image: '../../../assets/images/alexander.png',
      repeats: '22',
      duration: '8:34',
      url: 'test'
    },
    {
      id: 3,
      title: 'Iron maiden - the legacy',
      image: '../../../assets/images/legacy.png',
      repeats: '11',
      duration: '9:23',
      url: 'test'
    },
    {
      id: 4,
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
      url: 'test'
    },
    {
      id: 5,
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
      url: 'test'
    },
    {
      id: 6,
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
      url: 'test'
    },
    {
      id: 7,
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
      url: 'test'
    },
    {
      id: 8,
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      id: 9,
      title: 'Metallica - Sad But TEEEES',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      id: 10,
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      id: 11,
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      id: 12,
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      id: 13,
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
    },
    {
      id: 14,
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
  favoriteInDisplay: number = 1;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

  }

  next() {
    this.carousel.slickNext();
  }

  previous() {
    this.carousel.slickPrev();
  }


  nextList() {
    this.favoriteInDisplay = this.favoriteInDisplay + 8;
    if (this.favoriteInDisplay > 14) this.favoriteInDisplay = 14;
    document.getElementById(this.favoriteInDisplay.toString()).scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' });
  }

  previousList() {
    this.favoriteInDisplay = this.favoriteInDisplay - 8;
    if (this.favoriteInDisplay < 1) this.favoriteInDisplay = 1;
    document.getElementById(this.favoriteInDisplay.toString()).scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' });
  }

  go2Song(song) {
    this.router.navigate(['/media/player', { url: song.url, title: song.title }]);
  }

}
