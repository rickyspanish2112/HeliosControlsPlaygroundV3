import { Component, OnInit, ViewChild } from '@angular/core';
import { Declarationtype } from '../model/declarationtypes';
import { Observable } from 'rxjs';
import { State } from '../model/state';
import { Country } from '../model/country';
import { MatAutocompleteTrigger, MatDialog } from '@angular/material';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { GetdataService } from '../service/getdata.service';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/operators';
import { LookupdialogComponent } from '../lookupdialog/lookupdialog.component';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  errorMessage: string;
  toggleLookupElement = false;

  declarationTypes$: Observable<Declarationtype[]>;
  declarationTypes: Declarationtype[] = [];
  stateGroupsOptions$: Observable<State[]>;
  stateGroups: State[] = [];
  countries: Country[] = [];
  selectedCountry: Country;
  selectedCountryName: string;

  typeCtrl = new FormControl();
  stateForm: FormGroup = this.fb.group({
    stateGroup: ''
  });

  countryLookupDialogForm = new FormControl();
  countryLookupFormGroup: FormGroup = this.fb.group({
    countryLookupFormGroup: ''
  });

  countryCtrl = new FormControl();

  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  constructor(
    private getDataService: GetdataService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getDeclarationTypes();
    this.getStates();
    this.getCountries();

    this.declarationTypes$ = this.typeCtrl.valueChanges.pipe(
      map(type =>
        // type ? this.filteredTypes(type) : this.declarationTypes.slice()
        this.filteredTypes(type)
      )
    );

    this.stateGroupsOptions$ = this.stateForm
      .get('stateGroup')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterGroup(value))
      );
  }

  private filteredTypes(value: string): Declarationtype[] {
    const filterValue = value.toLowerCase();

    return this.declarationTypes.filter(
      state => state.value.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private getStates() {
    this.getDataService.getAllStates().subscribe(data => {
      return (this.stateGroups = data);
    });
  }

  private getDeclarationTypes() {
    this.getDataService.getAllDeclarationTypes().subscribe(data => {
      return (this.declarationTypes = data);
    });
  }

  filterGroup(value: any): any {
    if (value) {
      return this.stateGroups
        .map(group => ({
          letter: group.letter,
          names: _filter(group.names, value)
        }))
        .filter(group => group.names.length > 0);
    }
  }

  onCountryCodeChanged(value: string) {
    const country = this.countries.find(x => x.code === value);

    if (country === null) {
      this.selectedCountry.code = 'Unable to find country';
    } else {
      this.selectedCountryName = country.name;
    }
  }

  getCountries() {
    this.getDataService.getAllCountries().subscribe(data => {
      return (this.countries = data);
    });
  }

  openLookupDialog(event: any): void {
    if (event.target.value !== '?') {
      return;
    }

    this.dialog.open(LookupdialogComponent, {
      width: '450px'
    });
  }

  toggleLookup(event: any): void {
    if (event.target.value !== '?') {
      return;
    }

    this.toggleLookupElement = true;
  }

  clearAll = () => {
    this.countryLookupFormGroup.reset();
  }

}
