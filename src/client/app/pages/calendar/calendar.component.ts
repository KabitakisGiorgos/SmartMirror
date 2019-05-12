import { Component, OnInit } from '@angular/core';
import { AssistantService } from '../../services/assistant.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor(private assistant: AssistantService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
