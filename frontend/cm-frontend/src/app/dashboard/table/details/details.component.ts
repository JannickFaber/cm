
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { inject } from '@angular/core';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

  data = inject(MAT_DIALOG_DATA);
}