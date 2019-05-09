import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Country } from '../model/country';
import { GetdataService } from '../service/getdata.service';

@Component({
  selector: 'app-lookupdialog',
  templateUrl: './lookupdialog.component.html',
  styleUrls: ['./lookupdialog.component.scss']
})
export class LookupdialogComponent implements OnInit {
  cache: Country[];
  rows: Country[];
  bobs: string[];


  myGroup: FormGroup;

  codeFilter: string;
  nameFilter: string;

  constructor(
    private getDataService: GetdataService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getCountries();

    this.myGroup = this.fb.group({
      countryCodeFC: '',
      countryNameFC: ''
    });


    this.myGroup.get('countryCodeFC').valueChanges
    .subscribe(val => {
      this.codeFilter = val;
      this.applyAllFilters();
    });

    this.myGroup.get('countryNameFC').valueChanges
    .subscribe(val => {
      this.nameFilter = val;
      this.applyAllFilters();
    });

  }

  private applyAllFilters = () => {
    let rows = this.cache;

    if (!!this.codeFilter) {
      rows = rows.filter(r => r.code.toLowerCase().startsWith(this.codeFilter.toLowerCase()));
    }

    if (!!this.nameFilter) {
      rows = rows.filter(r => r.name.toLowerCase().startsWith(this.nameFilter.toLowerCase()));
    }

    this.rows = rows;
  }

  getCountries() {
    this.getDataService.getAllCountries().subscribe(data => {
      this.cache = data;
      this.rows = [...this.cache];
    });
  }

  clearAll = () => {
    this.myGroup.reset();
  }

}
