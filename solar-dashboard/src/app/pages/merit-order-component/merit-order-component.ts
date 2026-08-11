import { Component, inject, computed } from '@angular/core';
import { MeritOrderStore, Block } from '../../stores/merit-order.store';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-merit-order-component',
  imports: [CdkDropList, CdkDrag],
  standalone: true,
  templateUrl: './merit-order-component.html',
  styleUrl: './merit-order-component.scss',
})
export class MeritOrderComponent {
  meritOrderStore = inject(MeritOrderStore);
  //meritOrder = this.meritOrderStore.getMeritOrderTable



  getHour(period: number): number {
    return Math.floor((period - 1) / 4) + 1;
  }

  yAxis = computed(() => {
    const max =this.meritOrderStore.maxPeriodValue();

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

  constructor() {
    this.meritOrderStore.loadMeritOrder();

  }

}
