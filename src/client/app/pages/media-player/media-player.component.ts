import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit {

  url: string;
  constructor(
    private route: ActivatedRoute
  ) {
    this.url = this.route.snapshot.paramMap.get('song');
  }

  ngOnInit() {
    console.log(this.url);
  }

}
