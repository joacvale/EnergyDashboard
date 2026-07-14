import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ActionCardsComponent } from "../../components/action-cards-component/action-cards-component";

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, ActionCardsComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent { }
