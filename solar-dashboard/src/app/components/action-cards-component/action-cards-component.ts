import { Component, input } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-action-cards-component',
  imports: [MatCardModule, MatIconModule, MatChipsModule, RouterLink],
  templateUrl: './action-cards-component.html',
  styleUrl: './action-cards-component.scss',
})
export class ActionCardsComponent {
  title = input<string>();
  icon = input<string>();
  description = input<string>();
  chipText = input<string>();
  disabled = input<boolean>(false);
  navigateTo = input<string>('');
}
