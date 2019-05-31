import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/dataservice.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent{

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataService) { }

              formControl = new FormControl('', [
                Validators.required
                // Validators.email,
              ]);

              getErrorMessage() {
                return this.formControl.hasError('required') ? 'Required field' :
                  this.formControl.hasError('email') ? 'Not a valid email' :
                    '';
              }

              submit() {
                // emppty stuff
              }

              onNoClick(): void {
                this.dialogRef.close();
              }

              stopEdit(): void {
                this.dataService.updatePort(this.data);
              }

}
