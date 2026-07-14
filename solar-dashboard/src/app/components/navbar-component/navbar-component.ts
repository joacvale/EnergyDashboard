import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true, //serve para indicar que o componente é independente e não precisa ser declarado em um módulo
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  title = 'Solar Energy Dashboard';
  icon = 'light_mode';
}
