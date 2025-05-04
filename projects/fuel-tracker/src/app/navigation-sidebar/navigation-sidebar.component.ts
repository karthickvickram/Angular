import { CommonModule, NgFor } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FuelService } from '../services/fuelService';
import { sideMenuId } from '../Model/menuList';
import { Subject, takeUntil } from 'rxjs';

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
export class NavigationSidebarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('emptySpace') emptySpace!: ElementRef<HTMLDivElement>;
  sideMenuList: any = [];
  private destroyed$ = new Subject<void>();
  
  constructor(private fuelService: FuelService) { }

  ngOnInit() {
    this.sideMenuList = [
      {
        id: sideMenuId.entry,
        menuName: 'Entry',
        routerLink: '/entry',
        iconClass: 'pi pi-gauge',
      },
      {
        id: sideMenuId.Log,
        menuName: 'Log',
        routerLink: '/log',
        iconClass: 'pi pi-list',
      },
      {
        id: sideMenuId.Metrics,
        menuName: 'Metrics',
        routerLink: '/metrics',
        iconClass: 'pi pi-database',
      },
      {
        id: sideMenuId.Dashboard,
        menuName: 'Dashboard',
        routerLink: '/dashboard',
        iconClass: 'pi pi-chart-line',
      }
    ]

    this.fuelService.navigationUI$
    .pipe(takeUntil(this.destroyed$))
    .subscribe({
      next: (res) => {
        this.onLinkSelect(res);
      }
    })
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

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
