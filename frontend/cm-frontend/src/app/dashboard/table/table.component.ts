import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { ChemicalProcessData } from '../chemical-process-data';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  displayedColumns: string[] = ['name', 'cas', 'country', 'impact'];
  data = [
    { name: "1,1'-methylenedibenzene", cas: "101-81-5", country: "DE", impact: "GWP100" },
    { name: "1,2,3-trichlorobenzene", cas: "87-61-6", country: "US", impact: "Acidification" },
    { name: "1,2-diaminopropane", cas: "78-90-0", country: "FR", impact: "Eutrophication" },
    { name: "1,3-dichloropropene", cas: "542-75-6", country: "CN", impact: "Ozone Depletion" },
    { name: "1,8-Diazabicyclo(5.4.0)undec-7-ene", cas: "6674-22-2", country: "JP", impact: "Smog Formation" }
  ];
  dataSource = new MatTableDataSource(this.data);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() chemicalProcessData: ChemicalProcessData[] = [];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
