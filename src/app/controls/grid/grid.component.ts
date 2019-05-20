import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatTableDataSource, Sort } from '@angular/material';

export interface Grid {
  player: string;
  game: string;
  score: number;
  newScore: number;
}

const gridColumnNames: Grid[] = [
 /*  { player: 'Top Gun', game: 'River Raid', score: 15, newScore: undefined },
  { player: 'ThePro', game: 'River Raid', score: 11, newScore: undefined },
  { player: 'Ninja', game: 'Counter Strike', score: 10, newScore: undefined },
  { player: 'Killer', game: 'Counter Strike', score: 9, newScore: undefined },
  { player: 'Psycho', game: 'Counter Strike', score: 6, newScore: undefined },
  { player: 'Noob', game: 'Counter Strike', score: 3, newScore: undefined },
  { player: 'Lagger', game: 'Counter Strike', score: 4, newScore: undefined } */
];

const ELEMENT_DATA: Element[] = [];


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})


export class GridComponent implements OnInit {

  value1 = '';
  displayedColumns = ['type'];
  // dataSource = new MatTableDataSource();

  columns = ['score', 'add'];
  dataSource: MatTableDataSource<Grid>;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyToAll(newScore: number) {
    this.dataSource.filteredData.forEach(s => s.newScore = newScore);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(gridColumnNames.slice());
    this.dataSource.paginator = this.paginator;
  }

  removeAll() {
    this.dataSource.data = [];
  }

  removeAt(index: number) {
    const data = this.dataSource.data;
    data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);

    this.dataSource.data = data;
  }

  reset() {
    this.dataSource.data = gridColumnNames.slice();
    this.table.renderRows();
  }

  sortData(sort: Sort) {
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
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


}

