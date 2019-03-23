import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NewsComponent } from './news/news.component';
import { NotesComponent } from './notes/notes.component';
import { HealthComponent } from './health/health.component';
import { MediaComponent } from './media/media.component';

const coreRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'news', component: NewsComponent },
  { path: 'notes', component: NotesComponent },
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
    HealthComponent, 
    MediaComponent
  ],
  exports: [RouterModule]
})
export class CoreRoutingModule { }