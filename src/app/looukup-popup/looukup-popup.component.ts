import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Declarationtype } from '../model/declarationtypes';
import { State } from '../model/state';
import { Country } from '../model/country';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { GetdataService } from '../service/getdata.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { startWith, map } from 'rxjs/operators';

export const FILTER = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-looukup-popup',
  templateUrl: './looukup-popup.component.html',
  styleUrls: ['./looukup-popup.component.scss']
})
export class LooukupPopupComponent implements OnInit {
  errorMessage: string;
  toggleLookupElement = false;
  declarationTypes$: Observable<Declarationtype[]>;
  declarationTypes: Declarationtype[] = [];
  stateGroupsOptions$: Observable<State[]>;
  stateGroups: State[] = [];
  countries: Country[] = [];
  selectedCountry: Country;
  selectedCountryName: string;
  codeFilter: string;
  nameFilter: string;
  countryLookupInput: string;
  countryModalDialogLookupInput: any;

  countryLookupExpandingDialogForm = new FormControl();
  countryLookupExpandingDialogFormGroup: FormGroup = this.fb.group({
    countryCodeFC: '',
    countryNameFC: ''
  });

  countryCtrl = new FormControl();
  rows: Country[];
  displayedColumns = ['code', 'name'];
  dataSource = new MatTableDataSource(this.rows);

  @Output() closeLookup: EventEmitter<boolean> = new EventEmitter();
  @Output() setAdditionalCodeValue: EventEmitter<any> = new EventEmitter();

  constructor(
    private getDataService: GetdataService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.getCountries();

    this.countryLookupExpandingDialogFormGroup.get('countryCodeFC').valueChanges
      .subscribe(val => {
        this.codeFilter = val;

        this.applyAllFilters();
      });

    this.countryLookupExpandingDialogFormGroup.get('countryNameFC').valueChanges
      .subscribe(val => {
        this.nameFilter = val;
        this.applyAllFilters();
      });

    }

  cellClicked(element) {
    this.toggleLookupElement = false;
    this.countryLookupInput = element.name;
  }

  clearAll = () => {
    this.countryLookupExpandingDialogFormGroup.reset();
  }

  private getCountries() {
    this.getDataService.getAllCountries().subscribe(data => {
      return (this.countries = data);
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
}
