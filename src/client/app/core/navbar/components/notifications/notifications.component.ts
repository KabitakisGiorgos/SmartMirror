import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../../../types/classes';
import { SocketService } from '../../../../services/socket.service';
import { LoggerService } from '../../../../services/logger.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Array<Notification>;
  constructor(private socketService: SocketService,
    private logger: LoggerService) {
    this.socketService.init()
      .then(() => {
        this.socketService.syncUpdates('notification', null, (event, data) => {
          delete data._id;
          delete data.__v;
          this.notifications.unshift(data);
          this.logger.log(data, 'NotificationsComp');
        });

        this.socketService.socketMessages((type, data) => {
          this.logger.log(data, 'NotificationComp');
          // Here the data need json parse
        });
      });
    this.notifications = [{
      type: 'Schedule',
      severity: 'red',
      text: 'You must leave 10 mins earlier to be for work in time',
    },
    {
      type: 'Notification',
      severity: 'green',
      text: 'Water heater is ready'
    }];
  }

  ngOnInit() {
  }
  //FIXME: on destroy unsyncupdate 
}
