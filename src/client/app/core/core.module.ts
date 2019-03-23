import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CoreRoutingModule } from './core.routes.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NavbarComponent } from './navbar/navbar.component';
import { WeatherComponent } from './navbar/components/weather/weather.component';
import { NotificationsComponent } from './navbar/components/notifications/notifications.component';

@NgModule({
  declarations: [
    NotificationsComponent,
    WeatherComponent,
    NavbarComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SlickCarouselModule
  ],
  exports: [
    NavbarComponent,
    CoreRoutingModule,
  ]
})
export class CoreModule { }
