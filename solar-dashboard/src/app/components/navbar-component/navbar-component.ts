import { Component, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { output } from '@angular/core';
import { SolarPanelService } from '../../services/solar-panel.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSelectModule, FormsModule, RouterLink, MatSidenavModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavbarComponent {
  solarPanelService = inject(SolarPanelService);
  menuClick = output<void>();

  title = 'Solar Energy Dashboard';
  icon = 'light_mode';
  isLogged = false;

  login() {
    this.isLogged = true;
  }

  logout() {
    this.isLogged = false;
  }


  openSidepanel() {
    this.menuClick.emit();
  }

  get selectedCountry() {
    return this.solarPanelService.selectedCountry();
  }

  updateCountry(country: string) {
    this.solarPanelService.selectedCountry.set(country);
  }
}