import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { PlyrComponent } from 'ngx-plyr';
import Plyr from 'plyr';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit {
  @ViewChild(PlyrComponent)
  plyr: PlyrComponent;
  url: string;

  constructor(
    private route: ActivatedRoute,
    private events: EventsService
  ) {
    this.url = this.route.snapshot.paramMap.get('song');
    this.events.publish('navbar-display', { action: 'toogle' });
    this.events.publish('menu-display', { action: 'toogle' });
  }

  videoSources: Plyr.Source[] = [
    {
      src: 'bTqVqk7FSmY',
      provider: 'youtube',
    },
  ];

  ngOnInit() {
    console.log(this.url);
  }

  play() {
    this.plyr.player.play() // or this.plyr.player.play()
  }

  stop() {
    this.plyr.player.stop() // or this.plyr.player.play()
  }

  played(event) {
    console.log('played', event);
  }

  ngOnDestroy() {
    this.events.publish('navbar-display', { action: 'toogle' });
    this.events.publish('menu-display', { action: 'toogle' });
  }

}
