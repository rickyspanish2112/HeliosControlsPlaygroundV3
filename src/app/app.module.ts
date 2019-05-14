import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlsComponent } from './controls/controls.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LookupdialogComponent } from './lookupdialog/lookupdialog.component';

import { ScrollDispatcher, ScrollingModule } from '@angular/cdk/scrolling';
import { MatGridListResponsiveModule } from '../lib/mat-grid-list-responsive/mat-grid-list-responsive.module';

@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    LookupdialogComponent
  ],
  entryComponents: [
    LookupdialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ScrollingModule,
    MatGridListResponsiveModule
  ],
  providers: [ScrollDispatcher],
  bootstrap: [AppComponent]
})
export class AppModule { }
