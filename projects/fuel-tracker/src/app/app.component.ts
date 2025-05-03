import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastMessageComponent } from './toast-message/toast-message.component';
import { NavigationSidebarComponent } from './navigation-sidebar/navigation-sidebar.component';
import { FuelService } from './services/fuelService';

@Component({
  selector: 'app-root-fuel-tracker',
  imports: [
    RouterOutlet,
    RouterModule,
    NavigationSidebarComponent,
    ToastMessageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'fuel-tracker';

  constructor(private fuelService: FuelService) {

  }
  
  ngOnInit(): void {
    this.fuelService.getFuelEntries().subscribe({
      next: (entries) => {
        const sortedEntries = entries.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        this.fuelService.storeFuelEntries(sortedEntries);
      },
      error: (error) => {
        console.error('Error fetching fuel entries:', error);
        this.fuelService.storeFuelEntries([]);
      }
    })
  }

}
