import { LoginComponent } from '@abp/ng.account';
import { AuthService, ReplaceableComponentsService } from '@abp/ng.core';
import { eThemeLeptonXComponents } from '@abp/ng.theme.lepton-x';
import { EmptyLayoutComponent } from '@abp/ng.theme.lepton-x/layouts';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-root',
  template: `
    <abp-loader-bar />
    <abp-dynamic-layout />
    <abp-internet-status />
  `,
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private replaceableComponents: ReplaceableComponentsService
  ) { }
  ngOnInit() {


    if (!this.authService.getAccessToken()) {
      this.replaceableComponents.add({
        component: EmptyLayoutComponent,
        key: eThemeLeptonXComponents.ApplicationLayout,
      });
      this.router.navigate(['/accountc']);
    } else {
      this.authService.init().then(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/']);
        });
      });

    }
  }
}
