import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { SidenavComponent } from './core/layout/sidenav/sidenav.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidenavComponent, FooterComponent, UserProfileComponent],
  templateUrl: './app.component.html'
})
export class AppComponent { }