import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../../services/socket.service';
import { LoggerService } from '../../../services/logger.service';
import config from '../../../services/config.json';
import * as d3 from 'd3';
import { MatDialog } from '@angular/material';
import { NotificationModalComponent } from '../notification-modal/notification-modal.component';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  newsNotifications: any = [];
  chartJson: object = {
    'children': []
  };

  constructor(
    private socketService: SocketService,
    private logger: LoggerService,
    private http: HttpClient,
    private modal: MatDialog) {
    this.http.get('/api/notifications')
      .toPromise()
      .then(data => {
        this.chartJson['children'] = data;
        this.chartInit();
      })
      .catch(err => {
        this.logger.error(err);
      });

    this.socketService.init('Notifications')
      .then(() => {
        this.socketService.syncUpdates('notification', null, (event, data) => {
          this.chartJson['children'].push(data);
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
        this.updateChart();
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

  chartInit() {
    var diameter = 110;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var bubble = d3.pack()
      .size([diameter, diameter])
      .padding(5);

    var svg = d3.select('#chart').append('svg')
      .attr('viewBox', '0 0 ' + (diameter) + ' ' + diameter)
      .attr('width', (diameter))
      .attr('height', diameter)
      .attr('class', 'chart-svg mychart');

    var root = d3.hierarchy(this.chartJson)
      .sum(function (d) { return d.severity; })
      .sort(function (a, b) { return b.severity - a.severity; });

    bubble(root);

    var node = svg.selectAll('.node')
      .data(root.children)
      .enter()
      .append('g').attr('class', 'node')
      .attr('transform', function (d) { return 'translate(' + d.x + ' ' + d.y + ')'; })
      .append('g').attr('class', 'graph');

    node.append('circle')
      .attr('r', function (d) { return d.r; })
      .style('fill', function (d) {
        return color(d.data.type);
      });

    svg.append('g')
      .attr('class', 'legendOrdinal')
      .attr('transform', 'translate(600,40)');
  }


  updateChart() {
    d3.select('#chart').select('svg').remove();
    this.chartInit();
    $('.chart-svg.mychart').css('border', '5px solid white')
      .css('box-shadow', '0px 0px 50px white');

    setTimeout(() => {
      $('.chart-svg.mychart').css('border', 'unset')
        .css('box-shadow', 'unset');
    }, config.chart.animation);
  }

  test() {
    this.modal.open(NotificationModalComponent, {
      width: '500px',
      height: '500px'
    });
  }
}
