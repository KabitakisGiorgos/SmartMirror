import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes.module';
import { CoreModule } from './core/core.module';
import { ServiceXModule } from './serviceX/serviceX.module';
import { HttpClientModule } from '@angular/common/http';
import { SingletonModule } from './services/singleton.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    CoreModule,
    ServiceXModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SingletonModule.forRoot({}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
