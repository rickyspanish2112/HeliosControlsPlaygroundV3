import { Component, OnInit, ViewChild } from '@angular/core';
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
  additionCode: string;
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
    data.splice(this.paginator.pageIndex * this.paginator.pageSize + index, 1);
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

    const dsi = this.dataSourceIndex - 1; // Need to remove 1 here to keep data source and row index aligned
    const tri = this.tableRowIndex;

    this.getSelectedDataFromDataSource(dsi, tri);

    this.additionCodeLookupInput = event.code;
  }
 private getSelectedDataFromDataSource(dsi: number, tri: number) {
  const matchedData = ELEMENT_DATA.filter(x => x.index === dsi);
  console.log('Found matching array data at index: ' + matchedData[0].index);

  console.log(`About to update datasource array at index ${ matchedData[0].index}. Value ${ this.additionCodeLookupInput }`);

  }

  private doAddRow() {

    if (this.dataSourceIndex > 0) {
      this.updateDataSource();
    } else {
      this.updateDataSource();
    }
    this.dataSourceIndex++;
  }

  private updateDataSource() {
    ELEMENT_DATA.push({ index: this.dataSourceIndex, category: '', type: '', additionCode: '', reference: '' });
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }
}
