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

  displayedColumns: string[] = ['name', 'cas', 'country', 'total', 'bioEmission', 'bioRemoval', 'fossil', 'landUse'];
  dataSource: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() set chemicalProcessData(data: ChemicalProcessData[]) {

    const tableData = this.mapData(data);
    this.dataSource = new MatTableDataSource(tableData);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private mapData(data: ChemicalProcessData[]): TableData[] {
    return data.map(chemData => {
      return {
        name: chemData.name,
        cas: chemData.cas,
        country: chemData.country,
        total: chemData.gwpTotal.toFixed(3),
        bioEmission: chemData.gwpBiogenicEmissions.toFixed(3),
        bioRemoval: chemData.gwpBiogenicRemoval.toFixed(3),
        fossil: chemData.gwpFossil.toFixed(3),
        landUse: chemData.gwpLandUse.toFixed(3),
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}

interface TableData {
  name: string;
  cas: string;
  country: string;
  total: string;
  bioEmission: string;
  bioRemoval: string;
  fossil: string;
  landUse: string;
}