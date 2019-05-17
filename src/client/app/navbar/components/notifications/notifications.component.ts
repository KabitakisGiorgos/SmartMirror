import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../../services/socket.service';
import { LoggerService } from '../../../services/logger.service';
import config from '../../../services/config.json';
import * as d3 from 'd3';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { LeapHandlerService } from '../../../services/leap-handler.service';
import { BrowserPlatformLocation } from '@angular/platform-browser/src/browser/location/browser_platform_location';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  newsNotifications: any = [];
  chartJson: object = {
    'children': []
  };
  clickableElements: Array<string> = ['notifications', 'notification_modal'];

  constructor(
    private socketService: SocketService,
    private logger: LoggerService,
    private http: HttpClient,
    public ngxSmartModalService: NgxSmartModalService,
    private leap: LeapHandlerService) {

    this.leap.registerDivs(this.clickableElements);
    this.http.get('/api/notifications')
      .toPromise()
      .then(data => {
        this.chartJson['children'] = data;
        this.chartInit('#chart', 110);
      })
      .catch(err => {
        this.logger.error(err);
      });

    this.socketService.init('Notifications')
      .then(() => {
        this.socketService.syncUpdates('notification', null, (event, data) => {
          this.chartJson['children'].push(data);
          this.newsNotifications.unshift(data);
          this.updateChart('#chart2', 600, true);
          this.showNot();//Bubble Calling
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
    this.leap.unregisterDivs(this.clickableElements);
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
      bubble.addClass(this.newsNotifications[this.newsNotifications.length - 1].severity);
      var message = this.newsNotifications[this.newsNotifications.length - 1].text;
      if (message.length > 120) {
        message = message.substring(0, 120);
        message = message + ' ...';
      }

      $('#notification' + index + ' .message').text(message);
      bubble.show();
      this.newsNotifications.pop();
      setTimeout(() => {
        this.updateChart('#chart', 110);
        bubble.hide();
        if (this.newsNotifications.length > 0) {
          this.showNot();
        }//Bubble needs approximately 30000ms to reach top
      }, config.notification.delay);
    }
  }

  chartInit(selector, size, label?) {
    var diameter = size;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var bubble = d3.pack()
      .size([diameter, diameter])
      .padding(5);

    var svg = d3.select(selector).append('svg')
      .attr('viewBox', '0 0 ' + (diameter) + ' ' + diameter)
      .attr('width', (diameter))
      .attr('height', diameter)
      .attr('class', 'chart-svg mychart');
    if (this.chartJson['children'].length > 0) {
      var root = d3.hierarchy(this.chartJson)
        .sum(function (d) {
          switch (d.severity) {
            case 'Urgent':
              return 100;
            case 'High':
              return 75;
            case 'Normal':
              return 50;
            case 'Low':
              return 25;
            default:
              return 10;
          }
        })
        .sort(function (a, b) { return 10 });

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
          switch (d.data.severity) {
            case 'Urgent':
              return '#ff0000';
            case 'High':
              return '#ffa500';
            case 'Normal':
              return '#000ff0';
            case 'Low':
              return '#008000';
            default:
              return '#808080';
          }
        });

      if (label) {
        node.append('text')
          .attr('x', '0')
          .attr('y', '0')
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .text((d) => {
            return d.data.text;
          })
          .each(function (d) {
            var text = d3.select(this),
              width = d.r * 2,
              x = 0,
              y = 0,
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1,
              tspan = text.text(null).append('tspan').attr('x', x).attr('y', y);
            while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(' '));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + 'em').text(word);
              }
            }
          });
      }
    }


    svg.append('g')
      .attr('class', 'legendOrdinal')
      .attr('transform', 'translate(600,40)');
  }


  updateChart(selector, size, label?) {
    d3.select(selector).select('svg').remove();
    this.chartInit(selector, size, label);


    if (selector === '#chart') {
      $('.chart-svg.mychart').css('border', '5px solid white')
        .css('box-shadow', '0px 0px 50px white');
      setTimeout(() => {
        $('.chart-svg.mychart').css('border', 'unset')
          .css('box-shadow', 'unset');
      }, config.chart.animation);
    }

  }

  openModal() {
    this.ngxSmartModalService.getModal('myModal').open();
    setTimeout(() => {//Dont remove its for async
      d3.select('#chart2').select('svg').remove();
      this.chartInit('#chart2', 600, true);
    });
  }

  closeModal() {
    this.ngxSmartModalService.getModal('myModal').close();
  }
}
