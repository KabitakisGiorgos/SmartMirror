import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit {

  url: string;
  constructor(
    private route: ActivatedRoute,
    private events: EventsService
  ) {
    this.url = this.route.snapshot.paramMap.get('song');
    this.events.publish('navbar-display', { action: 'toogle' });
    this.events.publish('menu-display', { action: 'toogle' });
  }

  ngOnInit() {
    console.log(this.url);
  }

  ngOnDestroy() {
    this.events.publish('navbar-display', { action: 'toogle' });
    this.events.publish('menu-display', { action: 'toogle' });
  }

}
