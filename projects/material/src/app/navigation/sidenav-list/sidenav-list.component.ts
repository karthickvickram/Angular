import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
  standalone: true,
  imports: [
    MaterialModule, 
    RouterLink,
    TranslateModule,
    CommonModule
  ]
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output() closeSideNav = new EventEmitter<void>();
  isAuth: boolean = false;
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authService: AuthService
  ) { }
  
  ngOnInit() {
    this.authService.authChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        this.isAuth = res;
      })
  }

  onCloseSideNav() {
    this.closeSideNav.emit();
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }

}
