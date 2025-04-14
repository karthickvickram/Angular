import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FuelEntryComponent } from './fuel-entry/fuel-entry.component';
import { ButtonModule } from 'primeng/button';
import { MatDialog } from '@angular/material/dialog';
import { ToastMessageComponent } from './toast-message/toast-message.component';
import { FuelListComponent } from './fuel-list/fuel-list.component';

@Component({
  selector: 'app-root-fuel-tracker',
  imports: [
    RouterOutlet,
    ButtonModule,
    ToastMessageComponent,
    FuelListComponent
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
      height: '75vh',
      width: '60vw',
      disableClose: true
    })

    dialogRef.afterClosed().subscribe({
      next(value) {
      }, error(err) {
        console.log(err);
      }
    })

  }
}
