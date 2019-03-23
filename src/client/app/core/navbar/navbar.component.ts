import { Component, OnInit } from '@angular/core';
import { AssistantService } from '../../services/assistant.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  today = new Date();
  constructor(private assistant: AssistantService) {
    setInterval(() => {
      this.today = new Date();
    }, 1000)
  }

  ngOnInit() {
  }

}
