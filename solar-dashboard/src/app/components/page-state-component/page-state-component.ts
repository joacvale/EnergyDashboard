import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-page-state-component',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './page-state-component.html',
  styleUrl: './page-state-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageStateComponent {

  loading = input<boolean>(false);
  error = input<string | null>(null);
  isEmpty = input<boolean>(false);

  retry = output<void>();
  add = output<void>();

}