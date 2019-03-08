import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CoreRoutingModule } from './core.routes.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent
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
