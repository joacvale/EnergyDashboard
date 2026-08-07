import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { MeritOrderService } from '../services/merit-order.service';
import { firstValueFrom } from 'rxjs';



export interface MeritOrder {
    period: number;
    blocks: Block[];
};

export interface Block {
    label: string;
    name: string;
    programValue: number;
    offerPrice: number;
    bandPercentage: number;
};

export interface MeritOrderState {
    meritOrderTable: MeritOrder[];
    meritOrderOriginal: MeritOrder[];
    selectedBlock: Block | null;
    loading: boolean;
    error: string | null;
    lastUpdate: Date;
};

const initialState: MeritOrderState = {
    meritOrderTable: [],
    meritOrderOriginal: [],
    selectedBlock: null,
    loading: false,
    error: null,
    lastUpdate: new Date(),
};

export const MeritOrderStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),

    withMethods((store, meritOrderService = inject(MeritOrderService)) => ({
        loadMeritOrder: async () => {
            patchState(store, {
                meritOrderTable: [],
                meritOrderOriginal: [],
                selectedBlock: null,
                loading: true,
                error: null,
                lastUpdate: new Date(),
            })
            try {
                const data = await meritOrderService.getMeritOrder();
                const meritOrderData = data.content.meritOrder[0].upPriceMeritOrder;
              
                patchState(store, {
                    meritOrderTable: meritOrderData,
                    meritOrderOriginal: meritOrderData,
                });
            } catch (error){
                patchState(store, {
                    error:'error loading merit order data'
                })
            } finally{
                patchState(store, {
                    loading:false
                })
            }
            
        }
    }))

)
