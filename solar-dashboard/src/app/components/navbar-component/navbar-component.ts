import { Component, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { COUNTRIES, CountryCode } from '../../enums';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidepanelComponent } from "../sidepanel-component/sidepanel-component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { inject } from '@angular/core';

import { output } from '@angular/core';





@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSelectModule, FormsModule, RouterLink, MatSidenavModule, MatDialogModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavbarComponent {
  title = 'Solar Energy Dashboard';
  icon = 'light_mode';
  isLogged = false;
  selectedCountry = CountryCode.PORTUGAL;
  countries = COUNTRIES

  login() {
    this.isLogged = true;
  }

  logout() {
    this.isLogged = false;
  }




  menuClick = output<void>();

  openSidepanel() {
    this.menuClick.emit();
  }


}