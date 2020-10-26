import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserModel } from '../shared/models/model';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  user: UserModel;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._authService.getUserInfo().subscribe(data => {
      this.user = data;
    });
  }

  logout(){
    this._authService.signOut().then(data => {
      console.log(data);
      console.log('user logged out');
      this._router.navigate(['/']);
    });
  }
}
