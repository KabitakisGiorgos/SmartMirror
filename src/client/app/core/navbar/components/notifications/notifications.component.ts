import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Array<any>;//FIXME: to have an interface and take events from node
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
