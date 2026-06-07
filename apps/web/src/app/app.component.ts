import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
    templateUrl: './app.component.html'
   imports: [RouterOutlet, HeaderComponent, SidenavComponent, FooterComponent, UserProfileComponent],
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { SidenavComponent } from './core/layout/sidenav/sidenav.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { filter } from 'rxjs/operators';

})
export class AppComponent {
  showLayout = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects.split('?')[0];
      this.showLayout = !['/login', '/register'].includes(url);
    });
  }
}