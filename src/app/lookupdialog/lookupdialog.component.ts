import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Country } from '../model/country';
import { GetdataService } from '../service/getdata.service';
import { MatTableDataSource, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-lookupdialog',
  templateUrl: './lookupdialog.component.html',
  styleUrls: ['./lookupdialog.component.scss']
})
export class LookupdialogComponent implements OnInit {
  rows: Country[];
  countries: Country[] = [];
  displayedColumns = ['code', 'name'];
  dataSource = new MatTableDataSource(this.rows);
  countryLookupInput: string;

  @Output() rowSelected = new EventEmitter<any>();

  countryLookupDialogForm = new FormControl();
  countryLookupFormGroup: FormGroup = this.fb.group({
    countryCodeFC: '',
    countryNameFC: ''
  });

  codeFilter: string;
  nameFilter: string;

  constructor(
    private getDataService: GetdataService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LookupdialogComponent>
  ) { }

  ngOnInit() {
    this.countryLookupFormGroup.get('countryCodeFC').valueChanges
      .subscribe(val => {
        this.codeFilter = val;
        this.applyAllFilters();
      });

    this.countryLookupFormGroup.get('countryNameFC').valueChanges
      .subscribe(val => {
        this.nameFilter = val;
        this.applyAllFilters();
      });

  }

  private applyAllFilters = () => {
    let rows;

    this.getDataService.getAllCountries().subscribe(data => {
      return (this.countries = data);
    });

    if (!!this.codeFilter) {
      rows = this.countries.filter(r => r.code.toLowerCase().startsWith(this.codeFilter.toLowerCase()));
    }

    if (!!this.nameFilter) {
      rows = this.countries.filter(r => r.name.toLowerCase().startsWith(this.nameFilter.toLowerCase()));
    }
    this.dataSource = rows;
  }

  clearAll = () => {
    this.countryLookupFormGroup.reset();
  }

  onCancel() {
    this.dialogRef.close(true);
  }

  cellClicked(element) {
    this.rowSelected.emit( element.name);
    this.dialogRef.close(true);
  }

}
