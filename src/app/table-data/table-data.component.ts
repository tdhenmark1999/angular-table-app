import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
export * from '@emotion/styled'

export interface UserData {
  id: number;
  name: string;
  email: string;
  gender: string;
}

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent implements OnInit {
  displayedColumns: (keyof UserData)[] = ['id', 'name', 'email', 'gender'];
  dataSource = new MatTableDataSource<UserData>();
  currentFilterColumn: string | null = null;
  filteredData: UserData[] = [];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    // Fetch the data from the JSON file
    this.http.get<UserData[]>('/assets/data.json').subscribe(data => {
      this.dataSource.data = data;
    });

    // Assign the sort to the data source
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event, column: keyof UserData): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (!filterValue) {
      // if no filter value we reset the filter
      this.dataSource.filter = '';
      return;
    }
    this.dataSource.filterPredicate = (data, filter) => {
      const textToSearch = data[column] && data[column].toString().toLowerCase() || '';
      return textToSearch.indexOf(filter.toLowerCase()) !== -1;
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filteredData = this.dataSource.filteredData;

  }


  toggleFilter(column: string): void {
    // If the current filter is already open, close it, otherwise open the new one
    this.currentFilterColumn = this.currentFilterColumn === column ? null : column;
  }

  isFilterVisible(column: string): boolean {
    return this.currentFilterColumn === column;
  }


}
