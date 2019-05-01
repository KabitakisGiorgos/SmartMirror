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
  videoSources: Plyr.Source[] = [];

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
    this.videoSources.push({
      src: this.url,
      title: this.title
    });
  }

  //FIXME: do this change and on leap movement and add the controllers too
  //FIXME: timers to hide again and see the interaction
  ngAfterViewInit() {
    this.plyr.player.play();
    this.plyr
  }

  // play() {
  //   this.plyr.player.play() // or this.plyr.player.play()
  // }

  // stop() {
  //   this.plyr.player.stop() // or this.plyr.player.play()
  // }

  pause(event) {
    this.events.publish('navbar-display', { action: 'display' });
    this.events.publish('menu-display', { action: 'display' });
    $('#plyrPlayer').css('width', '1662px')
      .css('margin', 'auto');
    $('.plyr__controls').css('display', 'flex');
  }

  play(event) {
    this.events.publish('navbar-display', { action: 'hide' });
    this.events.publish('menu-display', { action: 'hide' });
    $('#plyrPlayer').css('width', '1960px')
      .css('margin', 'unset')
      .css('margin-left', '-15px');

    $('.plyr__controls').css('display', 'none');//WORKS
  }



  ngOnDestroy() {
    this.events.publish('navbar-display', { action: 'display' });
    this.events.publish('menu-display', { action: 'display' });
    this.renderer.setStyle(document.body, 'background-color', '#0C3958');
  }

}
