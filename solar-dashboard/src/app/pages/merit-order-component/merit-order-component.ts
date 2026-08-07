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

  async test(){
    const periodIndex = 1;
    const blockIndex = 4;
    //test 1
    const testGetMeritOrderTable = await this.meritOrderStore.loadMeritOrder();
    //test 2
    const testGetMeritOrder = this.meritOrderStore.getMeritOrderByPeriod(periodIndex);
    //test 3
    const testGetBlock =  this.meritOrderStore.getBlockByIndex(periodIndex, blockIndex);
    //test 4
    if(testGetMeritOrder && testGetBlock){
      const testIncrement = this.meritOrderStore.incrementProgramValue(testGetMeritOrder, testGetBlock);

    }
  }

  constructor() {
    this.test();
  }
}
