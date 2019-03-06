import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceXComponent } from './serviceX.component';
import { ServiceXRoutingModule } from './serviceX.routes.module';
import { SocketService } from '../components/socket/socket.service';

@NgModule({
  declarations: [
    ServiceXComponent,
  ],
  imports: [
    CommonModule,
    ServiceXRoutingModule
  ],
  providers: [
    SocketService,
  ]
})
export class ServiceXModule { }
