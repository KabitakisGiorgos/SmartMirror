import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NewsComponent } from './news/news.component';
import { NotesComponent } from './notes/notes.component';
import { WeatherComponent } from './weather/weather.component';
import { HealthComponent } from './health/health.component';
import { MediaComponent } from './media/media.component';

const coreRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'menu', component: MenuComponent, data: { page: '1' } },
  { path: 'calendar', component: CalendarComponent },
  { path: 'news', component: NewsComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'weather', component: WeatherComponent },
  { path: 'health', component: HealthComponent },
  { path: 'media', component: MediaComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(coreRoutes)
  ],
  declarations: [
    CalendarComponent,
    NewsComponent,
    NotesComponent,
    WeatherComponent,
    HealthComponent, 
    MediaComponent
  ],
  exports: [RouterModule]
})
export class CoreRoutingModule { }