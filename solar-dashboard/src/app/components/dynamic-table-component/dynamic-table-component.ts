import { Component, computed, input, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfferUnit, OfferUnitQuarter } from '../../interfaces/offer-unit.interface';
import { MatTableDataSource } from '@angular/material/table';

type QuarterField =
  | 'volume'
  | 'price'
  | 'netPosition'
  | 'damPrice';


@Component({
  selector: 'app-dynamic-table-component',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './dynamic-table-component.html',
  styleUrl: './dynamic-table-component.scss',
})

export class DynamicTableComponent {
  offerUnit = input.required<OfferUnit>();

  tableData: {
    rowName: string;
    field: QuarterField;
  }[] = [
      {
        rowName: 'Volume',
        field: 'volume'
      },
      {
        rowName: 'Price',
        field: 'price'
      },
      {
        rowName: 'Net Position',
        field: 'netPosition'
      },
      {
        rowName: 'DAM Price',
        field: 'damPrice'
      }
    ];

  displayedColumns = [
    'field',
    ...Array.from(
      { length: 96 },
      (_, i) => `q${i + 1}`
    )
  ];

  hours = Array.from(
    { length: 24 },
    (_, i) => ({
      label: `H${i + 1}`
    })
  );


  getValue(quarter: OfferUnitQuarter, field: 'volume' | 'price' | 'netPosition' | 'damPrice') {
    return quarter[field];
  }

  setValue(quarter: OfferUnitQuarter, field: 'volume' | 'price' | 'netPosition' | 'damPrice', value: number) {

    quarter[field] = Number(value.toFixed(2));
  }

  save() { }
}
