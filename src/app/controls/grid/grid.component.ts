import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTable,
  MatTableDataSource,
  Sort,
  PageEvent
} from '@angular/material';
import { Type } from 'src/app/model/type';

export interface Grid {
  index: number;
  category: string;
  type: string;
  additionalCode: string;
  reference: string;
}

const ELEMENT_DATA: Grid[] = [];

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  expanded = false;
  columns = ['category', 'type', 'additionalCode', 'ref', 'add'];
  dataSource: MatTableDataSource<Grid>;
  additionCodeLookupInput: string;
  dataSourceIndex: number;
  tableRowIndex: number;

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  categories: Type[] = [
    { code: 'Z', description: 'Description 1' },
    { code: 'Y', description: 'Description 2' }
  ];

  types: Type[] = [
    { code: '741', description: 'Description 1' },
    { code: '380', description: 'Description 2' }
  ];

  displayCategory: Type;

 constructor() {}


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSourceIndex = 0;
  }

  addRow() {
    this.doAddRow();
    this.expanded = false;
  }

  toggleLookup(event: any, element: any, index: number): void {
    if (event.target.value !== '?') {
      return;
    }

    this.tableRowIndex = index;
    event.target.value = '';
    element.expanded = true;
  }

  removeAt(index: number) {
    const data = this.dataSource.data;
    data.splice(index, 1);
    this.dataSource.data = data;
    this.expanded = false;
  }

  onDown() {
    this.addRow();
  }

  closeLookupHandler(element: any) {
    console.log('Close lookup event received');
    element.expanded = false;
  }

  updateAdditionalCodeHandler(event: any, element: any) {
    console.log('Update Addition Code event received: ' + event.code);
    element.expanded = false;
    this.updateSelectedDataRow(this.tableRowIndex, event.code);
  }

  private updateSelectedDataRow(tableRowIndex: number, addtionalCode: any) {
    const matchedData = ELEMENT_DATA.find(x => x.index === tableRowIndex);
    console.log('Found matching array data at index: ' + tableRowIndex);

    console.log('About to update datasource with Additonal code value: ' + addtionalCode);
    matchedData.additionalCode = addtionalCode;
  }

  private doAddRow() {

   /*  if (this.dataSourceIndex > 0) {
      this.addNewDataSourceArrayObject();
    } else {
      this.addNewDataSourceArrayObject();
    } */

    this.addNewDataSourceArrayObject();

    this.dataSourceIndex++;
  }

  private addNewDataSourceArrayObject() {
    ELEMENT_DATA.push({ index: this.dataSourceIndex, category: '', type: '', additionalCode: '', reference: '' });
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }
}
