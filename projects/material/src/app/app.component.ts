import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from './material.module';
import { HeaderComponent } from './welcome/navigation/header/header.component';
import { SidenavListComponent } from './welcome/navigation/sidenav-list/sidenav-list.component';

@Component({
  selector: 'app-root-material',
  standalone: true,
  imports: [
    RouterOutlet, 
    //Modules
    RouterModule, 
    MaterialModule, 
    //Components
    HeaderComponent,
    SidenavListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppMaterialComponent {
  title = 'material';
}
