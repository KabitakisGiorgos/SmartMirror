import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { PlyrComponent } from 'ngx-plyr';
import Plyr from 'plyr';
import * as $ from 'jquery';
import { LeapHandlerService } from '../../services/leap-handler.service';
import { debugMode } from '../../../environments/environment';
@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent {
  @ViewChild(PlyrComponent)
  plyr: PlyrComponent;
  url: string;
  title: string;
  autoplay: number = 0;
  fullScreen: boolean = true;

  videoSources = [
    {
      title: 'Post Malone - Rockstar ft. 21 Savage',
      src: '../../../assets/video/postmalone.mp4'
    },
    {
      title: 'Disturbed - The Vengeful One',
      src: '../../../assets/video/vengful.mp4'
    },
    {
      title: 'Metallica: Dream No More',
      src: '../../../assets/video/dream.mp4'
    },
    {
      title: 'Metallica - Sad But True',
      src: '../../../assets/video/sad.mp4'
    },
    {
      title: 'ΛΕΞ - ΤΙΠΟΤΑ ΣΤΟΝ ΚΟΣΜΟ',
      src: '../../../assets/video/lex.mp4'
    },
    {
      title: 'Will Smith - The Greatest Motivational Speech Ever',
      src: '../../../assets/video/smith.mp4'
    }
  ];
  player: Plyr;
  clickableElements: Array<string> = ['plyrPlayer'];//FIXME: the suggested to

  constructor(
    private route: ActivatedRoute,
    private events: EventsService,
    private renderer: Renderer2,
    private leap: LeapHandlerService
  ) {
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
    this.url = this.route.snapshot.paramMap.get('url');
    this.title = this.route.snapshot.paramMap.get('title');

    let index = this.videoSources.findIndex((element: any) => {
      return element.title == this.title;
    });

    this.videoSources.splice(index, 1);
    this.videoSources.unshift({
      src: this.url,
      title: this.title
    });
  }

  ngOnInit() {

  }

  //FIXME: navigation to songs and add a suggested playlist
  ngAfterViewInit() {
    this.plyr.player.config.autoplay = true;
    this.plyr.player.config.hideControls = false;
    this.player.on('ended', () => {
      this.autoplay++;
      try {
        this.player.source = {
          type: 'video',
          title: 'Example title',
          sources: [
            {
              src: this.videoSources[this.autoplay].src
            }
          ]
        };
      } catch (e) {
        this.autoplay = 0;
        this.player.source = {
          type: 'video',
          title: 'Example title',
          sources: [
            {
              src: this.videoSources[this.autoplay].src
            }
          ]
        };
      }
      $('.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio').append('<div class="plyr_title">' + this.videoSources[this.autoplay].title + '</div>');
      this.plyr.player.play()
    });
    $('.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio').append('<div class="plyr_title">' + this.title + '</div>');//Add title 
    this.plyr.player.play();
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
    this.ComponentsDisplay();
    this.playerDisplayControlls();
  }

  play(event?) {//Eventlisteners
    this.ComponentsHide();
    this.playerHideControlls();
  }

  togglePlayer() {
    if (!debugMode.Cursor) {//When we dont have leap
      if (this.plyr.player.playing) {
        this.pause();
        this.plyr.player.pause()
      }
      else {
        this.play();
        this.plyr.player.play()
      }
    }
  }

  ngOnDestroy() {
    this.events.publish('navbar-display', { action: 'display' });
    this.events.publish('menu-display', { action: 'display' });
    this.renderer.setStyle(document.body, 'background-color', '#0C3958');
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
    $('.plyr__controls').css('display', 'flex');//display controlls 
    $('.plyr_title').css('display', 'block');
  }

  playerHideControlls() {
    $('.plyr__controls').css('display', 'none');//hide controlls
    $('.plyr_title').css('display', 'none');
  }
}
