import { Component, computed, input, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfferUnit, OfferUnitQuarter, Cell, QuarterField } from '../../interfaces/offer-unit.interface';
import { InputDirective } from '../../directives/input-directive';
import { OfferUnitStore } from '../../stores/offer-unit.store';


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

  isDragging = false;

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
    const value = quarter[field];
    if (value == null) {
      return '';
    }

    return value.toFixed(2);
  }

  setValue(quarter: OfferUnitQuarter, field: QuarterField, value: string) {
    if (!value.trim()) {
      const cell: Cell = {
        id: `${this.offerUnit().id}-${quarter.quarter}-${field}`,
        offerUnitId: this.offerUnit().id,
        quarterNumber: quarter.quarter,
        field: field,
      };
      this.offerUnitStore.updateEditedValues(cell);
      this.offerUnitStore.updateErrorValues(cell);
      return;
    }
    const cell: Cell = {
      id: `${this.offerUnit().id}-${quarter.quarter}-${field}`,
      offerUnitId: this.offerUnit().id,
      quarterNumber: quarter.quarter,
      field: field,
      value: Number(value)
    };
    this.offerUnitStore.updateCell(cell);
  }

  isCellEdited(quarter: OfferUnitQuarter, field: QuarterField) {
    const cellId = this.offerUnit().id + '-' + quarter.quarter + '-' + field;
    return this.offerUnitStore.isCellEdited(cellId);
  }

  clear(offerUnitId: string) {
    this.offerUnitStore.clearChanges(offerUnitId);
  }

  isCellSelected(quarter: OfferUnitQuarter, field: QuarterField) {
    const cellId = this.offerUnit().id + '-' + quarter.quarter + '-' + field;
    return this.offerUnitStore.isCellSelected(cellId);
  }

  isInCross(quarter:OfferUnitQuarter, field:QuarterField){
    const cell: Cell = {
      id: `${this.offerUnit().id}-${quarter.quarter}-${field}`,
      offerUnitId: this.offerUnit().id,
      quarterNumber: quarter.quarter,
      field: field,
    };
    if(this.isCellEdited(quarter,field)){
      return false;
    }
    return this.offerUnitStore.isInCross(cell);
  }


  onMouseDown(event: MouseEvent, quarter: OfferUnitQuarter,field: QuarterField) {
    const cell: Cell = {
      id: `${this.offerUnit().id}-${quarter.quarter}-${field}`,
      offerUnitId: this.offerUnit().id,
      quarterNumber: quarter.quarter,
      field: field,
    };
    this.offerUnitStore.setCellActive(cell);


    if (event.ctrlKey) {
      this.isDragging = true;
      this.offerUnitStore.toggleSelectedCell(cell);
      return;
    }

    this.offerUnitStore.clearSelectedCells();
  }

  onMouseEnter(quarter: OfferUnitQuarter, field: QuarterField) {
    if (!this.isDragging) {
      return;
    }

    const cell: Cell = {
      id: `${this.offerUnit().id}-${quarter.quarter}-${field}`,
      offerUnitId: this.offerUnit().id,
      quarterNumber: quarter.quarter,
      field: field,
    };

    this.offerUnitStore.toggleSelectedCell(cell);
  }

  onMouseUp() {
    this.isDragging = false;
  }

  save() { }
}
