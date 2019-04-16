import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';
import { SocketService } from '../../../services/socket.service';
import { LoggerService } from '../../../services/logger.service';

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
  newsNotifications: any = [];

  constructor(
    private socketService: SocketService,
    private logger: LoggerService,
    private http: HttpClient) {
    this.http.get('/api/notifications')
      .toPromise()
      .then(data => {
        this.notifications = data;
      })
      .catch(err => {
        this.logger.error(err);
      });

    this.socketService.init('Notifications')
      .then(() => {
        this.socketService.syncUpdates('notification', null, (event, data) => {
          // FIXME: here is only for inserting regardless the event   
          //FIXME: Maybe regarding the event we could play another sound
          this.notifications.push(data);
          this.newsNotifications.push(data);
          this.showNot();
          this.logger.log(data, 'NotificationsComp');
        });

        this.socketService.socketMessages((type, data) => {
          this.logger.log(data, 'NotificationsComp');
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

  showNot() {
    var index = -1;
    for (let i = 0; i < 3; i++) {
      if ($('#notification' + i).css('display') === 'none') {
        index = i;
        break;
      }
    }
    if (index != -1) {
      this.notificationAudio();
      var bubble = $('#notification' + index);
      bubble.show();
      this.newsNotifications.pop();//FIXME: pass the data
      setTimeout(() => {
        bubble.hide();

        if (this.newsNotifications.length > 0) {
          this.showNot();
        }
      }, 37000);//FIXME: put this dealy of bubble showing to a config the 30s is the border to reacch the top of screen
    }
  }

  animateCSS(element, animationName, callback) {//TODO:  this works with animateCSS
    const node = document.getElementById(element)
    node.classList.add('animated infinite', animationName)

    function handleAnimationEnd() {
      node.classList.remove('animated', animationName)
      node.removeEventListener('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
  }
}
