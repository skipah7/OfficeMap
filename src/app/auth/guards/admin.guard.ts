import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class AdminGuard implements CanLoad {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  canLoad(route: Route): Observable<boolean> | boolean {
    if (this.authenticationService.isCurrentEmployeeAdmin) {
      return true;
    };

    this.router.navigate(['/']);
    return false;
  }
}
