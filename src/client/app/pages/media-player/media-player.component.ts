import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { PlyrComponent } from 'ngx-plyr';
import Plyr from 'plyr';
import * as $ from 'jquery';

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

  constructor(
    private route: ActivatedRoute,
    private events: EventsService,
    private renderer: Renderer2
  ) {
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

  //FIXME: do this change and on leap movement and add the controllers too
  //FIXME: timers to hide again and see the interaction
  //FIXME: make functions about all the components hide and display
  ngAfterViewInit() {
    this.plyr.player.config.autoplay = true;
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

  pause(event) {
    // this.events.publish('navbar-display', { action: 'display' });
    // this.events.publish('menu-display', { action: 'display' });
    // $('#plyrPlayer').css('width', '1662px')//fix size
    //   .css('margin', 'auto');
    $('.plyr__controls').css('display', 'flex');//display controlls 
    // $('.plyr_title').css('display', 'block');

  }

  play(event) {
    this.events.publish('navbar-display', { action: 'hide' });
    this.events.publish('menu-display', { action: 'hide' });
    $('#plyrPlayer').css('width', '1960px')
      .css('margin', 'unset')
      .css('margin-left', '-15px');

    $('.plyr__controls').css('display', 'none');//hide controlls
    $('.plyr_title').css('display', 'none');
  }

  ngOnDestroy() {
    this.events.publish('navbar-display', { action: 'display' });
    this.events.publish('menu-display', { action: 'display' });
    this.renderer.setStyle(document.body, 'background-color', '#0C3958');
  }
}