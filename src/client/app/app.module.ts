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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NotificationsComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
