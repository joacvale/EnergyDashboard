import { Component, computed, input, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfferUnit, OfferUnitQuarter } from '../../interfaces/offer-unit.interface';
import { InputDirective } from '../../directives/input-directive';
import { OfferUnitStore } from '../../stores/offer-unit.store';

type QuarterField =
  | 'volume'
  | 'price'
  | 'netPosition'
  | 'damPrice';


@Component({
  selector: 'app-dynamic-table-component',
  imports: [FormsModule, InputDirective],
  standalone: true,
  templateUrl: './dynamic-table-component.html',
  styleUrl: './dynamic-table-component.scss',
})

export class DynamicTableComponent {
  offerUnit = input.required<OfferUnit>();
  offerUnitStore = inject(OfferUnitStore);

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


  getValue(quarter: OfferUnitQuarter, field: QuarterField) {
    return quarter[field]; //todo - add something to make trunc it to 2 decimal cases
  }

  setValue(quarter: OfferUnitQuarter, field: QuarterField, value: string) {
    if (!value.trim()) {
      return;  
    }
    this.offerUnitStore.updateCell(this.offerUnit().id, quarter.quarter, field, Number(value));
  }

  isCellEdited(quarter:OfferUnitQuarter, field:QuarterField){
    return this.offerUnitStore.isCellEdited(this.offerUnit().id, quarter.quarter, field);
  }

  save() { }
}
