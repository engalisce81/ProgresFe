import { AuthService, ConfigStateService, LoginParams, ReplaceableComponentsService } from '@abp/ng.core';
import { eThemeLeptonXComponents } from '@abp/ng.theme.lepton-x';
import { EmptyLayoutComponent } from '@abp/ng.theme.lepton-x/layouts';
import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from 'src/app/service/loginService';

@Component({
  selector: 'app-login-custom',
  imports: [FormsModule,RouterLink, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit  {
   username = '';
  password = '';
  rememberMe = true;
 showPassword: boolean = false;
  constructor(private loginService: LoginService,private authService:AuthService ,private router:Router, private replaceableComponents: ReplaceableComponentsService
) {}
  ngOnInit(): void {
    //window.location.reload();
  }
  

  login() {
    this.loginService.login(this.username, this.password, this.rememberMe);
  }
   togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
