
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { inject } from '@angular/core';
import { ChemicalProcessData } from '../../chemical-process-data';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

  data: ChemicalProcessData = inject(MAT_DIALOG_DATA);
}