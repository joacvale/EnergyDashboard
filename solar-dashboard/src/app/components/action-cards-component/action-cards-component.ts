import { Component, input } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { RouterLink } from '@angular/router';
import { MatAnchor } from "@angular/material/button";
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-action-cards-component',
  imports: [MatCardModule, MatIconModule, MatChipsModule, RouterLink, MatAnchor],
  templateUrl: './action-cards-component.html',
  styleUrl: './action-cards-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionCardsComponent {
  title = input<string>();
  icon = input<string>();
  description = input<string>();
  chipText = input<string>();
  disabled = input<boolean>(false);
  navigateTo = input<string>('');
}
