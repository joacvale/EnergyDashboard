import meritOrderData from '../data/meritOrder.json';

import { Injectable } from '@angular/core';


@Injectable({
providedIn: 'root'
})
export class MeritOrderService {
    async getMeritOrder(){
        return meritOrderData;
    }

    getIncrement(){
        return 0.15;
    }
}


