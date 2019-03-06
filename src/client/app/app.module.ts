import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes.module';
import { CoreModule } from './core/core.module';
import { ServiceXModule } from './serviceX/serviceX.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    CoreModule,
    ServiceXModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
