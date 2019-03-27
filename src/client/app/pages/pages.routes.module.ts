import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NewsComponent } from './news/news.component';
import { NotesComponent } from './notes/notes.component';
import { HealthComponent } from './health/health.component';
import { MediaComponent } from './media/media.component';
import { ScheduleComponent } from './home/components/schedule/schedule.component'

const PageRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'news', component: NewsComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'health', component: HealthComponent },
  { path: 'media', component: MediaComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(PageRoutes)
  ],
  declarations: [
  ],
  exports: [RouterModule]
})
export class PageRoutingModule { }