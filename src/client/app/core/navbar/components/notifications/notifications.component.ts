import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../../../types/classes';
import { SocketService } from '../../../../services/socket.service';
import { LoggerService } from '../../../../services/logger.service';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';

@Component({
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ])
    ])
  ],
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: any;

  constructor(
    private socketService: SocketService,
    private logger: LoggerService,
    private http: HttpClient) {
    this.http.get('/api/notifications/last/3').subscribe(data => {
      this.notifications = data;
    },
      error => {
        this.logger.error(error);
      });

    this.socketService.init('Notifications')
      .then(() => {
        this.socketService.syncUpdates('notification', null, (event, data) => {
          // FIXME: here is only for inserting regardless the event   
          //FIXME: Maybe regarding the event we could play another sound
          this.notificationAudio();
          this.notifications.unshift(data);
          this.logger.log(data, 'NotificationsComp');
        });

        this.socketService.socketMessages((type, data) => {
          this.logger.log(data, 'NotificationComp');
          // Here the data need json parse
        });
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.socketService.unsyncUpdates('notification');
    this.socketService.unsubscribeMessages();
  }

  notificationAudio() {
    let audio = new Audio();
    audio.src = '../../../../../assets/sounds/notification.mp3';
    audio.load();
    audio.play();
  }
}
