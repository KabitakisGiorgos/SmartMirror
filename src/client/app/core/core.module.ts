import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CoreRoutingModule } from './core.routes.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SlickCarouselModule
  ],
  exports: [
    CoreRoutingModule,
  ]
})
export class CoreModule { }
