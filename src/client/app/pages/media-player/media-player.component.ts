import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { PlyrComponent } from 'ngx-plyr';
import Plyr from 'plyr';
import * as $ from 'jquery';
import { LeapHandlerService } from '../../services/leap-handler.service';
import { debugMode } from '../../../environments/environment';
import { AssistantService } from '../../services/assistant.service';
@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent {
  @ViewChild(PlyrComponent)
  plyr: PlyrComponent;
  title: string;
  autoplay: number = 0;
  fullScreen: boolean = true;
  controllers: boolean = false;

  videoSources = [
    {
      id: 0,
      title: 'Post Malone - Rockstar ft. 21 Savage',
      src: '../../../assets/video/postmalone.mp4',
      img: '../../../assets/images/post2.jpg',
      abbrev: 'rockstar'
    },
    {
      id: 1,
      title: 'Disturbed - The Vengeful One',
      src: '../../../assets/video/vengful.mp4',
      img: '../../../assets/images/vengful2.jpg',
      abbrev: 'the vengful one'
    },
    {
      id: 2,
      title: 'Metallica: Dream No More',
      src: '../../../assets/video/dream.mp4',
      img: '../../../assets/images/dream2.jpg',
      abbrev: 'dream no more'
    },
    {
      id: 3,
      title: 'Metallica - Sad But True',
      src: '../../../assets/video/sad.mp4',
      img: '../../../assets/images/sad2.jpg',
      abbrev: 'sad bad true'
    },
    {
      id: 4,
      title: 'ΛΕΞ - ΤΙΠΟΤΑ ΣΤΟΝ ΚΟΣΜΟ',
      src: '../../../assets/video/lex.mp4',
      img: '../../../assets/images/lex2.jpg',
      abbrev: 'lex'
    },
    {
      id: 5,
      title: 'Will Smith - The Greatest Motivational Speech Ever',
      src: '../../../assets/video/smith.mp4',
      img: '../../../assets/images/smith2.jpg',
      abbrev: 'the greatest motivational speech ever'
    }
  ];
  player: Plyr;
  clickableElements: Array<string> = ['plyrPlayer', 'back'];

  constructor(
    private route: ActivatedRoute,
    private events: EventsService,
    private renderer: Renderer2,
    private leap: LeapHandlerService,
    private router: Router,
    private assistant: AssistantService
  ) {
    this.assistant.subscribe('song', (data) => {
      let song = this.videoSources.find((element) => {
        return element.abbrev === data;
      });
      this.playSong(song);
    });

    this.assistant.subscribe('mediaControlls', (data) => {
      switch (data) {
        case 0:
          this.nextSong();
          break;
        case 1:
          this.previousSong();
          break;
        case 2:
          if (this.plyr.player.playing) {
            let tmp = this.plyr.player.volume;
            this.plyr.player.volume = this.plyr.player.volume - 0.6; // Sets volume at 50%
            this.assistant.say('Already playing idiot');
            setTimeout(() => {
              this.plyr.player.volume = tmp;
            }, 2000)
          } else this.togglePlayer()
          break;
        case 3:
          //FIXME:
          break;
        default:
          this.assistant.say('George messed up really bad');
      }
    });

    this.videoSources.forEach((song) => {
      this.clickableElements.push('suggestion' + song.id);
    });
    this.leap.registerDivs(this.clickableElements);
    this.events.subscribe('cursor', (data) => {
      if (this.fullScreen) {
        if (data.visibility) {
          this.playerDisplayControlls();
        } else {
          this.playerHideControlls();
        }
      }
    });
    this.renderer.setStyle(document.body, 'background-color', 'black');
    this.events.publish('navbar-display', { action: 'hide' });
    this.events.publish('menu-display', { action: 'hide' });
    this.title = this.route.snapshot.paramMap.get('title');

    let index = this.videoSources.findIndex((element: any) => {
      return element.title == this.title;
    });

    let element = this.videoSources[index];
    this.videoSources.splice(index, 1);
    this.videoSources.unshift(element);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.plyr.player.config.autoplay = true;
    this.plyr.player.config.hideControls = false;
    this.player.on('ended', () => {
      this.nextSong();
    });
    $('.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio').append('<div class="plyr_title">' + this.title + '</div>');//Add title 
    this.plyr.player.play();
    this.playerHideControlls();
  }

  // play() {
  //   this.plyr.player.play() // or this.plyr.player.play()
  // }

  // stop() {
  //   this.plyr.player.stop() // or this.plyr.player.play()
  // }

  // player.volume = 0.5; // Sets volume at 50%
  // player.currentTime = 10; // Seeks to 10 seconds

  pause(event?) {//Eventlisteners
    if (event && !event.detail.plyr.ended) {
      this.ComponentsDisplay();
      this.playerDisplayControlls();
    }
  }

  play(event?, manual?) {//Eventlisteners TODO:not usable anymore
    if (event && !manual) {
      this.ComponentsHide();
      this.playerHideControlls();
    }
  }

  togglePlayer() {
    if (this.plyr.player.playing) {
      this.pause();
      this.ComponentsDisplay();
      this.playerDisplayControlls();
      this.plyr.player.pause()
    }
    else {
      this.play(null, true);
      this.plyr.player.play();
      this.ComponentsHide();
    }
  }

  ngOnDestroy() {
    this.events.publish('navbar-display', { action: 'display' });
    this.events.publish('menu-display', { action: 'display' });
    this.renderer.setStyle(document.body, 'background-color', '#0C3958');
    this.leap.unregisterDivs(this.clickableElements);
    this.assistant.unsubscribe('song');
    this.assistant.unsubscribe('mediaControlls');
    this.events.unsubscribe('cursor');
  }

  ComponentsDisplay() {
    this.fullScreen = false;
    this.events.publish('navbar-display', { action: 'display' });
    this.events.publish('menu-display', { action: 'display' });
    $('#plyrPlayer').css('width', '1662px')//fix size
      .css('margin', 'auto');
  }

  ComponentsHide() {
    this.fullScreen = true;
    this.events.publish('navbar-display', { action: 'hide' });
    this.events.publish('menu-display', { action: 'hide' });
    $('#plyrPlayer').css('width', '1920px')
      .css('margin', 'unset')
      .css('margin-left', '-15px');
  }

  playerDisplayControlls() {
    this.controllers = true;
    $('.plyr__controls').css('display', 'flex');//display controlls 
    $('.plyr_title').css('display', 'block');
  }

  playerHideControlls() {
    this.controllers = false;
    $('.plyr__controls').css('display', 'none');//hide controlls
    $('.plyr_title').css('display', 'none');
  }

  playSong(song) {
    let index = this.videoSources.findIndex((element: any) => {
      return element.title == song.title;
    });

    let element = this.videoSources[index];
    this.videoSources.splice(index, 1);
    this.videoSources.unshift(element);

    this.player.source = {
      type: 'video',
      title: 'Example title',
      sources: [
        {
          src: element.src
        }
      ]
    };
    $('.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio').append('<div class="plyr_title">' + element.title + '</div>');
  }

  goBack() {
    this.router.navigate(['/media']);//FIXME: the icon
  }

  nextSong() {
    this.autoplay++;
    try {
      this.playSong(this.videoSources[this.autoplay]);
    } catch (e) {
      this.autoplay = 0;
      this.playSong(this.videoSources[this.autoplay]);
    }
    this.plyr.player.play();
    this.playerHideControlls();
  }

  previousSong() {
    this.autoplay--;
    try {
      this.playSong(this.videoSources[this.autoplay]);
    } catch (e) {
      this.autoplay = this.videoSources.length-1;
      this.playSong(this.videoSources[this.autoplay]);
    }
    this.plyr.player.play();
    this.playerHideControlls();
  }


  volume() {

  }

  seek() {

  }
}
