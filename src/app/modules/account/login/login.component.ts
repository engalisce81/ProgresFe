import { AuthService, ConfigStateService, LoginParams, ReplaceableComponentsService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from 'src/app/service/loginService';

@Component({
  selector: 'app-login-custom',
  imports: [FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent  {
   username = '';
  password = '';
  rememberMe = true;

  constructor(private loginService: LoginService,private authService:AuthService ,private router:Router) {}
  

  login() {
    this.loginService.login(this.username, this.password, this.rememberMe);
    window.location.reload();
    this.router.navigate(['/']);

  }

}
