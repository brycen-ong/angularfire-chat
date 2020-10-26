import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ){}

  canActivate(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this._authService.userState().then(user => {
        this._router.navigate(['/landing']);
        return resolve (true);
      }, err => {
        return resolve (true);
      });
    });
  }
}
