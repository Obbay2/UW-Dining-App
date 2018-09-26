import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent }   from './app.component';

import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
  imports:      [ BrowserModule, HttpModule, AgmCoreModule.forRoot({apiKey: 'AIzaSyAWOtW-pTZcJUps2LsN9bITjxYTq18G5WQ'}) ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }