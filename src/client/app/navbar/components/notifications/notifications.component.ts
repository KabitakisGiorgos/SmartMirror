import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../../services/socket.service';
import { LoggerService } from '../../../services/logger.service';
import config from '../../../services/config.json';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  notifications: any = [];
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
          this.notifications.push(data);
          this.newsNotifications.unshift(data);
          this.showNot();//Bubble Calling
          this.logger.log(data, 'NotificationsComp');
        });

        this.socketService.socketMessages((type, data) => {
          this.logger.log(data, 'NotificationsComp');
          // Here the data need json parse
        });
      });
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
      var message = this.newsNotifications[this.newsNotifications.length - 1].text;
      if (message.length > 120) {
        message = message.substring(0, 120);
        message = message + ' ...';
      }

      $('#notification' + index + ' .message').text(message);
      bubble.show();
      this.newsNotifications.pop();
      setTimeout(() => {
        bubble.hide();

        if (this.newsNotifications.length > 0) {
          this.showNot();
        }//Bubble needs approximately 30000ms to reach top
      }, config.notification.delay);
    }
  }

  animateCSS(element, animationName, callback) {//TODO:  this works with animateCSS Helper function placeholder here
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
