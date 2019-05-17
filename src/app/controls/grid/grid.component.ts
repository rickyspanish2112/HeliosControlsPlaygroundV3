import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatTableDataSource, Sort } from '@angular/material';

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: Element[] = [];


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})


export class GridComponent implements OnInit {

  value1 = '';
  displayedColumns = ['type'];
  dataSource = new MatTableDataSource();


  ngOnInit(): void {

  }


  addElement() {
    ELEMENT_DATA.push({position: 1, name: this.value1, weight: 1.0079, symbol: 'H'});
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  removeAt(index: number) {
  }
}

