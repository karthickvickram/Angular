import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
  standalone: true,
  imports: [MaterialModule, RouterLink]
})
export class SidenavListComponent implements OnInit {

  @Output() closeSideNav = new EventEmitter<void>();
  
  constructor() { }

  ngOnInit() {
  }

  onCloseSideNav() {
    this.closeSideNav.emit();
  }

}
