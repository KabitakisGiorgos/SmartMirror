import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
//FIXME: find a weather api with beautiful icons
export class WeatherComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}