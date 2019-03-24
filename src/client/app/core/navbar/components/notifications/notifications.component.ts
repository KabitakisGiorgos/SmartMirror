import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../../../types/classes';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Array<Notification>;//FIXME: to have an interface and take events from node
  constructor() {
    this.notifications = [{
      type: "Schedule",
      severity: "red",
      text: "You must leave 10 mins earlier to be for work in time",
    },
    {
      type: "Notification",
      severity: "green",
      text: "Water heater is ready"
    }];
  }

  ngOnInit() {
  }

}
