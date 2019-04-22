import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes.module';
import { PageModule } from './pages/pages.module';
import { ServiceXModule } from './serviceX/serviceX.module';
import { HttpClientModule } from '@angular/common/http';
import { SingletonModule } from './services/singleton.module';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationsComponent } from './navbar/components/notifications/notifications.component';
import { ToastrModule } from 'ngx-toastr';
import { MenuComponent } from './menu/menu.component';
import { NotificationModalComponent } from '../app/navbar/components/notification-modal/notification-modal.component'
@NgModule({
  declarations: [
    MenuComponent,
    AppComponent,
    NavbarComponent,
    NotificationsComponent,
    NotificationModalComponent
  ],
  imports: [
    ToastrModule.forRoot(),
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    PageModule,
    ServiceXModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SingletonModule.forRoot({})
  ],
  entryComponents: [NotificationModalComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
