import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <table mat-table [dataSource]="data" class="mat-elevation-z8">

      <!-- Stoff-Name -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> Stoff </th>
        <td mat-cell *matCellDef="let element"> {{element.name}} </td>
      </ng-container>

      <!-- CAS-Nummer -->
      <ng-container matColumnDef="cas">
        <th mat-header-cell *matHeaderCellDef> CAS-Nummer </th>
        <td mat-cell *matCellDef="let element"> {{element.cas}} </td>
      </ng-container>

      <!-- Land -->
      <ng-container matColumnDef="country">
        <th mat-header-cell *matHeaderCellDef> Land </th>
        <td mat-cell *matCellDef="let element"> {{element.country}} </td>
      </ng-container>

      <!-- Hauptumweltauswirkung -->
      <ng-container matColumnDef="impact">
        <th mat-header-cell *matHeaderCellDef> Haupt-Umweltauswirkung </th>
        <td mat-cell *matCellDef="let element"> {{element.impact}} </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [
    `
      table {
        width: 100%;
        margin: 20px 0;
      }
      th {
        text-align: left;
      }
    `
  ]
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
}
