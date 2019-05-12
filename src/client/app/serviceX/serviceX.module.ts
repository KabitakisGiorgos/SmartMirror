import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceXComponent } from './serviceX.component';
import { ServiceXRoutingModule } from './serviceX.routes.module';

@NgModule({
  declarations: [
    ServiceXComponent,
  ],
  imports: [
    CommonModule,
    ServiceXRoutingModule
  ],
  providers: [
  ]
})
export class ServiceXModule { }
