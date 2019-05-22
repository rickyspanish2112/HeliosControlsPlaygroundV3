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
  }

  addRow() {
    this.doAddRow();
    this.expanded = false;
  }

  toggleLookup(event: any, element: any): void {
    if (event.target.value !== '?') {
      return;
    }
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

  private doAddRow() {
    ELEMENT_DATA.push({ category: '', type: '', additionCode: '', reference: '' });
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }
}
