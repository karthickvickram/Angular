import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [
        MaterialModule,
        TranslateModule,
        RouterLink
    ]
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() sideNavToggle = new EventEmitter<void>();
  isAuth: boolean = false;
  authSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(res => {
      this.isAuth = res;
    });
  }

  onToggleSideNav() {
    this.sideNavToggle.emit();
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
