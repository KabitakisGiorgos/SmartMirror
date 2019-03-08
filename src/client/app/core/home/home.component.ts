import { Component, OnInit } from '@angular/core';
import { AssistantService } from '../../services/assistant.service';
import { Subscription } from 'rxjs';
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  subscription: Subscription;
  constructor(private assistant: AssistantService) {

  }

  ngOnInit() {
    this.assistant.assistantInit();
    this.subscription = this.assistant.subjectitem.subscribe((data) => {
      console.log(data);
    });
  }


  test() {
    this.assistant.test();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}