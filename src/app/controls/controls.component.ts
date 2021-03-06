import { Component, OnInit } from '@angular/core';
import { Declarationtype } from '../model/declarationtypes';
import { Observable, BehaviorSubject } from 'rxjs';
import { State } from '../model/state';
import { Country } from '../model/country';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, AbstractControl, FormArray } from '@angular/forms';
import { GetdataService } from '../service/getdata.service';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/operators';
import { LookupdialogComponent } from '../lookupdialog/lookupdialog.component';
import { TableData } from './table-data.model';

export const FILTER = (opt: string[], value: string): string[] => {
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
  codeFilter: string;
  nameFilter: string;
  // countryLookupInput: string;
 //  countryModalDialogLookupInput: any;

  typeCtrl = new FormControl();
  stateForm: FormGroup = this.fb.group({
    stateGroup: ''
  });


  countryLookupModalDialogFormControl = new FormControl();
  countryLookupModalDialogForm: FormGroup = this.fb.group({});

  countryLookupExpandingDialogFormControl = new FormControl();
  countryLookupExpandingDialogFormGroup: FormGroup = this.fb.group({
    countryCodeFC: '',
    countryNameFC: ''
  });

  countryCtrl = new FormControl();
  cache: Country[];
  rows: Country[];
  displayedColumns = ['code', 'name'];
  dataSource = new MatTableDataSource(this.rows);

  folders = [
    { name: 'Previous Documents', link: '#1' }
  ];

  responsive = true;
  cols = 1;


  constructor(
    private getDataService: GetdataService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getDeclarationTypes();
    this.getStates();
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

    this.declarationTypes$ = this.typeCtrl.valueChanges.pipe(
      map(type =>
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

  onCountryCodeChanged(value: string) {
    const country = this.countries.find(x => x.code === value);

    if (country === null) {
      this.selectedCountry.code = 'Unable to find country';
    } else {
      this.selectedCountryName = country.name;
    }
  }

  toggleLookup(event: any): void {
    if (event.target.value !== '?') {
      return;
    }

    event.target.value = '';
    this.toggleLookupElement = true;
  }

  openLookupDialog(event: any): void {
    if (event.target.value !== '?') {
      return;
    }

    event.target.value = '';

    const dialogRef = this.dialog.open (LookupdialogComponent, {width: '450px'});
    dialogRef.componentInstance.rowSelected.subscribe(result => {
      this.doSetResult(result);
    });

    dialogRef.afterClosed().subscribe(() => {
      dialogRef.componentInstance.rowSelected.unsubscribe();
    });
  }

  cellClicked(element) {
    this.toggleLookupElement = false;
    this.countryLookupExpandingDialogFormControl.setValue(element.name);
  }

  clearAll = () => {
    this.countryLookupExpandingDialogFormGroup.reset();
  }

  closeLookup() {
    this.toggleLookupElement = false;
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

 private filterGroup(value: any): any {
    if (value) {
      return this.stateGroups
        .map(group => ({
          letter: group.letter,
          names: FILTER(group.names, value)
        }))
        .filter(group => group.names.length > 0);
    }
  }

 private doSetResult(result: any) {
    this.countryLookupModalDialogFormControl.setValue(result);
  }

  alert(value: string) {
    window.alert(value);
  }

}
