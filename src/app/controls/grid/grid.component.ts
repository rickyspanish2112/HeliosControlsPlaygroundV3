import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTable,
  MatTableDataSource,
  Sort
} from '@angular/material';
import { Type } from 'src/app/model/type';

export interface Grid {
  code: string;
  type: string;
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

  categories: Type[] = [
    { code: 'Z', description: 'Description 1' },
    { code: 'Y', description: 'Description 2' }
  ];

  types: Type[] = [
    { code: '741', description: 'Description 1' },
    { code: '380', description: 'Description 2' }
  ];

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyToAll(newScore: number) {
    // this.dataSource.filteredData.forEach(s => s.newScore = newScore);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
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
    ELEMENT_DATA.push({ code: '', type: '', reference: '' });
    this.dataSource.paginator = this.paginator;

    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  /*   reset() {
    this.dataSource.data = gridColumnNames.slice();
    this.table.renderRows();
  } */

  /*  sortData(sort: Sort) {
    if (sort.active && sort.direction !== '') {
      this.dataSource.data = this.dataSource.data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'player': return this.compare(a.player, b.player, isAsc);
          case 'game': return this.compare(a.game, b.game, isAsc);
          case 'score': return this.compare(a.score, b.score, isAsc);
          default: return 0;
        }
      });
    }
  } */

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
