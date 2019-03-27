import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PageRoutingModule } from './pages.routes.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    SlickCarouselModule
  ],
  exports: [
    PageRoutingModule,
  ]
})
export class PageModule { }
