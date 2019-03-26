import { Component, OnInit } from '@angular/core';
import { AssistantService } from './services/assistant.service';
import * as $ from 'jquery';
import { CursorDebug } from '../environments/environment';
import { Cursor } from './Cursor/cursor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  cursor: Cursor;
  constructor(private assistant: AssistantService) {

  }

  ngOnInit() {
    this.assistant.assistantInit();

    // this.cursor = new Cursor();
    // this.cursor.Show();

    // $(document).on('mousemove', (e) => {
    //   if (CursorDebug) {
    //     var mousetop = e.pageY;
    //     var mouseleft = e.pageX;
    //     if ($('#cursor').is(":visible")) {

    //       this.cursor.Move(mousetop, mouseleft);
    //       // console.log(mousetop);
    //       // console.log(mouseleft);

    //     }
    //   }
    // });
  }
}
