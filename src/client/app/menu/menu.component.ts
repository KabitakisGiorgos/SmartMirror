import { Component, OnInit } from '@angular/core';
import { trigger, transition, query, stagger, animate, style, state } from '@angular/animations';
import { AssistantService } from '../services/assistant.service';

@Component({
  animations: [
    trigger('openClose', [
      state('open', style({
        bottom: '0px'
      })),
      state('closed', style({
        bottom: '-330px'
      })),
      transition('open => closed', [
        animate('0.75s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  visible: boolean = false;


  constructor(private assistant: AssistantService) { }

  ngOnInit() {
  }


  test() {
    this.visible = !this.visible;
  }
}
