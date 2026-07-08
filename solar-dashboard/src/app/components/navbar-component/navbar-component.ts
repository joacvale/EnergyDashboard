import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true, //serve para indicar que o componente é independente e não precisa ser declarado em um módulo
  imports: [MatToolbarModule, MatIconModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
})
export class Navbar {
  title = 'solar-dashboard';
  icon = 'solar_power';
}
