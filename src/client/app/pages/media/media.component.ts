import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { slideInUpOnEnterAnimation } from 'angular-animations';
import * as $ from 'jquery';
import { LeapHandlerService } from '../../services/leap-handler.service';
import { AssistantService } from '../../services/assistant.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  animations: [
    slideInUpOnEnterAnimation({ anchor: 'enter', duration: 1000 })
  ]
})
export class MediaComponent implements OnInit {
  @ViewChild('slickModal', { static: false }) carousel: any;
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
      id: 1,
      title: 'Post Malone - Rockstar ft. 21 Savage',
      image: '../../../assets/images/post.png',
      repeats: '12',
      duration: '4:01',
      url: '../../../assets/video/postmalone.mp4',
      abbrev: 'rockstar'
    },
    {
      id: 2,
      title: 'Disturbed - The Vengeful One',
      image: '../../../assets/images/vengful.png',
      repeats: '22',
      duration: '4:22',
      url: '../../../assets/video/vengful.mp4',
      abbrev: 'the vengful one'
    },
    {
      id: 3,
      title: 'Metallica: Dream No More',
      image: '../../../assets/images/dream.png',
      repeats: '11',
      duration: '6:38',
      url: '../../../assets/video/dream.mp4',
      abbrev: 'dream no more'
    },
    {
      id: 4,
      title: 'Metallica - Sad But True',
      image: '../../../assets/images/sad.png',
      repeats: '9',
      duration: '5:28',
      url: '../../../assets/video/sad.mp4',
      abbrev: 'sad bad true'
    },
    {
      id: 5,
      title: 'ΛΕΞ - ΤΙΠΟΤΑ ΣΤΟΝ ΚΟΣΜΟ',
      image: '../../../assets/images/lex.png',
      repeats: '11',
      duration: '3:19',
      url: '../../../assets/video/lex.mp4',
      abbrev: 'lex'
    },
    {
      id: 6,
      title: 'Will Smith - The Greatest Motivational Speech Ever',
      image: '../../../assets/images/smith.png',
      repeats: '22',
      duration: '10:17',
      url: '../../../assets/video/smith.mp4',
      abbrev: 'the greatest motivational speech ever'
    },
    {
      id: 7,
      title: 'Disturbed - The Night',
      image: '../../../assets/images/night.png',
      repeats: '9',
      duration: '4:46'
    }
  ];

  slideConfig = {
    slidesToShow: 6,
    slidesToScroll: 6,
    arrows: false,
    infinite: false,
  };
  favoriteInDisplay: number = 1;
  clickableElements: Array<string> = [];

  constructor(
    private router: Router,
    private leap: LeapHandlerService,
    private assistant: AssistantService
  ) {
    this.assistant.subscribe('song', (data) => {
      let song = this.favorites.find((element) => {
        return element.abbrev === data;
      });
      this.go2Song(song);
    });
    for (let i = 0; i < this.favorites.length; i++) {
      this.clickableElements.push('song' + this.favorites[i].id);
    }
    this.leap.registerDivs(this.clickableElements);
  }

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
    document.getElementById('song' + this.favoriteInDisplay.toString()).scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' });
  }

  previousList() {//For leap and assisant
    this.favoriteInDisplay = this.favoriteInDisplay - 8;
    if (this.favoriteInDisplay < 1) this.favoriteInDisplay = 1;
    document.getElementById('song' + this.favoriteInDisplay.toString()).scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' });
  }

  go2Song(song) {
    if (song.url)
      this.router.navigate(['/media/player', { title: song.title }]);
  }

  ngOnDestroy() {
    this.leap.unregisterDivs(this.clickableElements);
    this.assistant.unsubscribe('song');
  }
}
