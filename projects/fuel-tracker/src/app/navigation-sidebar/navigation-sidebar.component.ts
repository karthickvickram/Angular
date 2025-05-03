import { CommonModule, NgFor } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { query } from 'express';

@Component({
  selector: 'app-navigation-sidebar',
  templateUrl: './navigation-sidebar.component.html',
  styleUrls: ['./navigation-sidebar.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    NgFor,
    CommonModule
  ]
})
export class NavigationSidebarComponent implements OnInit, AfterViewInit {

  @ViewChild('emptySpace') emptySpace!: ElementRef<HTMLDivElement>;
  sideMenuList: any = [];
  
  constructor() { }

  ngOnInit() {
    this.sideMenuList = [
      {
        id: 1,
        menuName: 'Entry',
        routerLink: '/entry',
        iconClass: 'pi pi-gauge',
        queryParams: { mode: 'create' }
      },
      {
        id: 2,
        menuName: 'Log',
        routerLink: '/log',
        iconClass: 'pi pi-list',
        queryParams: {}
      },
      {
        id: 3,
        menuName: 'Metrics',
        routerLink: '/metrics',
        iconClass: 'pi pi-database',
        queryParams: {}
      },
      {
        id: 4,
        menuName: 'Dashboard',
        routerLink: '/dashboard',
        iconClass: 'pi pi-chart-line',
        queryParams: {}
      }
    ]
  }

  ngAfterViewInit(): void {
    this.removeSelectedClass();
  }

  onLinkSelect(n: any) {
    let navLinks = this.removeSelectedClass();
    navLinks?.[n].classList.add('selected');
  }

  get extraDivs(): any[] {
    return Array(this.sideMenuList.length + 2);
  }

  trackByIndex(index: number): number {
    return index;
  }
  
  updateMenuSelection(index: number) {
    const navLinks = this.emptySpace?.nativeElement?.querySelectorAll('.nav-link');
    navLinks?.forEach((link) => link.classList.remove('selected'));
    navLinks?.[index].classList.add('selected');
  }

  removeSelectedClass() {
    const navLinks = this.emptySpace?.nativeElement?.querySelectorAll('.nav-link');
    navLinks?.forEach((link) => link.classList.remove('selected'));

    return navLinks;
  }

}
