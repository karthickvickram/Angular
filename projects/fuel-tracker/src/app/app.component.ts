import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FuelEntryComponent } from './fuel-entry/fuel-entry.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root-fuel-tracker',
  imports: [
    RouterOutlet,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'fuel-tracker';

  constructor(private dialog: MatDialog) {

  }
  ngOnInit(): void {
    
  }

  openFuelEntry() {
    const dialogRef = this.dialog.open(FuelEntryComponent, {
      height: '90vh',
      width: '60vw'
    })

    dialogRef.afterClosed().subscribe({
      next(value) {
        console.log(value);
      }, error(err) {
        console.log(err);
      }
    })

  }
}
