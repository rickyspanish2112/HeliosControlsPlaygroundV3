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
import { GridComponent } from './controls/grid/grid.component';
import { LooukupPopupComponent } from './looukup-popup/looukup-popup.component';
import { ModalGridComponent } from './controls/modal-grid/modal-grid.component';
import { AddDialogComponent } from './dialogs/add/add.component';
import { DeleteDialogComponent } from './dialogs/delete/deletedialog.component';
import { EditDialogComponent } from './dialogs/edit/edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    LookupdialogComponent,
    GridComponent,
    LooukupPopupComponent,
    ModalGridComponent,
    AddDialogComponent,
    DeleteDialogComponent,
    EditDialogComponent
  ],
  entryComponents: [
    LookupdialogComponent,
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ScrollingModule
  ],
  providers: [ScrollDispatcher],
  bootstrap: [AppComponent]
})
export class AppModule { }
