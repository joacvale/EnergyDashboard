import { Component, input } from '@angular/core';
import { OfferUnit, OfferUnitQuarter } from '../../interfaces/offer-unit.interface';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-dynamic-table-component',
  imports: [JsonPipe],
  standalone:true,
  templateUrl: './dynamic-table-component.html',
  styleUrl: './dynamic-table-component.scss',
})
export class DynamicTableComponent {
  offerUnit = input<OfferUnit>();


  //load OfferUnit

}
