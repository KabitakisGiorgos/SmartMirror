import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRoutingModule } from './pages.routes.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { HealthComponent as HealthWidget } from './home/components/health/health.component';
import { HealthComponent } from './health/health.component';
import { NewsComponent as NewsWidget } from './home/components/news/news.component';
import { NewsComponent } from './news/news.component';
import { ScheduleComponent } from './home/components/schedule/schedule.component';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MediaComponent } from './media/media.component';

@NgModule({
  declarations: [
    HealthComponent,
    NewsWidget,
    ScheduleComponent,
    HomeComponent,
    CalendarComponent,
    NewsComponent,
    HealthWidget,
    MediaComponent
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    SlickCarouselModule
  ],
  exports: [
    PageRoutingModule
  ]
})
export class PageModule { }
