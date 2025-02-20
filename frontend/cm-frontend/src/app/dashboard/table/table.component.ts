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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { inject } from '@angular/core';
import { DetailsComponent } from './details/details.component';
import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  displayedColumns: string[] = ['name', 'cas', 'country', 'total'];
  dataSource: any;
  _chemicalProcessData: ChemicalProcessData[] = [];
  readonly dialog = inject(MatDialog);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() set chemicalProcessData(data: ChemicalProcessData[]) {

    this._chemicalProcessData = data;
    const tableData = this.mapData(data);
    this.dataSource = new MatTableDataSource(tableData);
  }

  toggleTable(value: string): void {
    if (this.displayedColumns.includes(value)) {
      this.displayedColumns = this.displayedColumns.filter(entry => entry !== value);
    } else {
      this.displayedColumns.push(value);
    }
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

  openDialog(data: any) {

    const cas = data.cas;
    const country = data.country;

    this.dialog.open(DetailsComponent, {data: this._chemicalProcessData.
      filter(processData => processData.country === country)
      .find(processData => processData.cas === cas)});
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