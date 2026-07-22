import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar-component/navbar-component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidepanelComponent } from './components/sidepanel-component/sidepanel-component';
import { AuthenticationService } from './services/authentication.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MatSidenavModule, SidepanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('solar-dashboard');

  authenticationService = inject(AuthenticationService);
}
