import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CoreRoutingModule } from './core.routes.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MenuComponent } from './menu/menu.component';
import { MenuCalendarComponent } from './menu/components/menu-calendar/menu-calendar.component';
import { MenuHealthComponent } from './menu/components/menu-health/menu-health.component';
import { MenuMediaComponent } from './menu/components/menu-media/menu-media.component';
import { MenuNewsComponent } from './menu/components/menu-news/menu-news.component';
import { MenuNotesComponent } from './menu/components/menu-notes/menu-notes.component';
import { MenuWeatherComponent } from './menu/components/menu-weather/menu-weather.component';

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    MenuCalendarComponent,
    MenuHealthComponent,
    MenuMediaComponent,
    MenuNewsComponent,
    MenuNotesComponent,
    MenuWeatherComponent
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
