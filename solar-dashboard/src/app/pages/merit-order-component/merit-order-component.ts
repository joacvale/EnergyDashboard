import { Component, inject } from '@angular/core';
import { MeritOrderStore } from '../../stores/merit-order.store';

@Component({
  selector: 'app-merit-order-component',
  imports: [],
  templateUrl: './merit-order-component.html',
  styleUrl: './merit-order-component.scss',
})
export class MeritOrderComponent {
  meritOrderStore = inject(MeritOrderStore);

  async getMeritOrder(){
    const test = await this.meritOrderStore.loadMeritOrder();
  }

  constructor() {
    this.getMeritOrder();
  }
}
