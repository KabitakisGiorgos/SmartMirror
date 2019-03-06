import { Component, OnInit } from '@angular/core';
import { SocketService } from '../components/socket/socket.service';
import { Http } from '@angular//http';

@Component({
    templateUrl: './serviceX.component.html',
    styleUrls: ['./serviceX.component.scss']
})
export class ServiceXComponent implements OnInit  {
    constructor(private socketService: SocketService, private http: Http) { }

    ngOnInit() {
        this.socketService.init()
            .then(() => {
                this.socketService.syncUpdates((eventType, data) => {
                    this.onSocketMessage(eventType, data);
                });
            });
        }

    onSocketMessage(eventType, data) {
        console.log('Socket Message received!');
        // Uncomment the following lines to retrieve event data
        // let event: EventType;
        // event = JSON.parse(data);
    }
}
