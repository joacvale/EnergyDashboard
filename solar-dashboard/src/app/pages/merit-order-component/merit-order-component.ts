import { Component, inject, computed, effect } from '@angular/core';
import { MeritOrderStore, Block } from '../../stores/merit-order.store';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-merit-order-component',
  imports: [CdkDropList, CdkDrag, MatTooltip],
  standalone: true,
  templateUrl: './merit-order-component.html',
  styleUrl: './merit-order-component.scss',
})
export class MeritOrderComponent {
  meritOrderStore = inject(MeritOrderStore);


  getHour(period: number): number {
    return Math.floor((period - 1) / 4) + 1;
  }

  yAxis = computed(() => {
    const max = this.meritOrderStore.maxPeriodValue();

    return [
      Number(max.toFixed(2)),
      Number((max * 0.75).toFixed(2)),
      Number((max * 0.5).toFixed(2)),
      Number((max * 0.25).toFixed(2)),
      0
    ];
  });

  drop(event: CdkDragDrop<Block[]>, period: number) {
    this.meritOrderStore.changeBlocksPositions(period, event.previousIndex, event.currentIndex);
  }

  getTooltip(block: Block): string {
    return `${block.label}

Up program aFRR - ${block.programValue} MW
Up qFFR price - ${block.offerPrice} €/MWh
Up aFRR - ${block.bandPercentage}%`;
  }


  periods = computed(() =>
    this.meritOrderStore.tsoUpTable()
  );

  tableRows = computed(() => [
    {
      label: 'TSO Up (MW)',
      values: this.meritOrderStore.tsoUpTable()
    },
    {
      label: 'TSO Up 95% (€/MWh)',
      values: this.meritOrderStore.tsoUp95Table()
    },
    {
      label: 'TSO Up 105% (€/MWh)',
      values: this.meritOrderStore.tsoUp105Table()
    }
  ]);



  line95 = computed(() => {
    const points: { x: number; y: number }[] = [];
    let y: number;
    this.meritOrderStore.tsoUpTable().forEach(element => {
      if (element.volume) {
        y = (600)-(element.volume * 0.95 * 600) / this.yAxis()[0];
      } else {
        y = 0;
      }
      const leftX = (element.period - 1) * 80 + 8;
      const rightX = (element.period - 1) * 80 + 72;

      points.push({ x: leftX, y });
      points.push({ x: rightX, y });
    });

    return points;
  });
  line95Path = computed(() => {
    const points = this.line95();

    if (!points.length) {
      return '';
    }

    return points.reduce((path, point, index) => {
      return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;}, '');
  });

  line105 = computed(() => {
    const points: { x: number; y: number }[] = [];
    let y: number;
    this.meritOrderStore.tsoUpTable().forEach(element => {
      if (element.volume) {
        y = (598)-(element.volume * 1.05 * 598) / this.yAxis()[0];
      } else {
        y = 0;
      }
      const leftX = (element.period - 1) * 80 + 8;
      const rightX = (element.period - 1) * 80 + 72;

      points.push({ x: leftX, y });
      points.push({ x: rightX, y });
    });

    return points;
  });
  line105Path = computed(() => {
    const points = this.line105();

    if (!points.length) {
      return '';
    }

    return points.reduce((path, point, index) => {
      return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;}, '');
  });


  constructor() {
    this.meritOrderStore.loadMeritOrder();
    effect(() => {
      this.meritOrderStore.calcTsoUp95();
      this.meritOrderStore.calcTsoUp105();
    })
  }

}
