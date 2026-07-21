import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfferUnit, OfferUnitQuarter } from '../../interfaces/offer-unit.interface';
import { MatTable, MatCell } from '@angular/material/table';
import { MatHeaderCell } from '@angular/material/table';
import { MatColumnDef, MatHeaderRow, MatRowDef, MatRow, MatCellDef, MatHeaderRowDef, MatHeaderCellDef } from '@angular/material/table';

@Component({
  selector: 'app-dynamic-table-component',
  imports: [FormsModule, MatTable, MatHeaderCell, MatCell, MatColumnDef, MatHeaderRow, MatRowDef, MatRow, MatCellDef, MatHeaderRowDef, MatHeaderCellDef],
  standalone: true,
  templateUrl: './dynamic-table-component.html',
  styleUrl: './dynamic-table-component.scss',
})
export class DynamicTableComponent {
  offerUnit = input.required<OfferUnit>();




  tableData: {
    field: string;
    rowName: string;
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
    quarter[field] = value;
  }
}
