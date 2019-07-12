import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/service/dataservice.service';
import { DataSource } from '@angular/cdk/table';
import { Port } from 'src/app/model/ports';
import { BehaviorSubject, Observable, merge, fromEvent } from 'rxjs';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AddDialogComponent } from 'src/app/dialogs/add/add.component';
import { EditDialogComponent } from 'src/app/dialogs/edit/edit-dialog.component';
import { DeleteDialogComponent } from 'src/app/dialogs/delete/deletedialog.component';

@Component({
  selector: 'app-modal-grid',
  templateUrl: './modal-grid.component.html',
  styleUrls: ['./modal-grid.component.scss']
})
export class ModalGridComponent implements OnInit {
  displayedColumns = ['code', 'name',  'city', 'state', 'country',  'runwayLength', 'type', 'actions'];
  exampleDatabase: DataService | null;
  dataSource: ExampleDataSource | null;
  index: number;
  code: string;


  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: DataService) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew(port: Port) {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: { Port: port }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, code: string, name: string, city: string, state: string, country: string, runwayLength: string, type: string) {
    this.code = code;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { code, name, city, state, country, runwayLength, type }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.code === this.code);
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }


  deleteItem(i: number, code: string, name: string, city: string, state: string, country: string, runwayLength: string, type: string) {
    this.index = i;
    this.code = code;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {i, code, name, city, state, country, runwayLength, type }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.code === this.code);
        // for delete we use splice in order to remove single object from DataService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.exampleDatabase = new DataService(this.httpClient);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

}


export class ExampleDataSource extends DataSource<Port> {
  filterChange = new BehaviorSubject('');

  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: Port[] = [];
  renderedData: Port[] = [];

  constructor(public exampleDatabase: DataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Port[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page
    ];

    this.exampleDatabase.getAllPorts();


    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this.exampleDatabase.data.slice().filter((issue: Port) => {
        const searchStr = (issue.code + issue.name).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this.paginator.pageSize);
      return this.renderedData;
    }
    ));
  }

  disconnect() { }

  /** Returns a sorted copy of the database data. */
  sortData(data: Port[]): Port[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this.sort.active) {
        case 'code': [propertyA, propertyB] = [a.code, b.code]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }

}
