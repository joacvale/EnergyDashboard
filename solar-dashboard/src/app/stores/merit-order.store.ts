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
    selectedMeritOrder: MeritOrder | null;
    loading: boolean;
    error: string | null;
    lastUpdate: Date;
};

const initialState: MeritOrderState = {
    meritOrderTable: [],
    meritOrderOriginal: [],
    selectedBlock: null,
    selectedMeritOrder: null,
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
                selectedMeritOrder: null,
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
                    lastUpdate: new Date(),
                });
            } catch (error) {
                patchState(store, {
                    error: 'error loading merit order data'
                })
            } finally {
                patchState(store, {
                    loading: false
                })
            }
        },
        getMeritOrderByPeriod(period: number) {
            patchState(store, {
                loading: true,
            });
            try {
                const meritOrder: MeritOrder = store.meritOrderTable()[period];
                if(!meritOrder){
                    return null;
                }
                return meritOrder;
            } catch (error) {
                patchState(store, {
                    error: 'error getting meritOrder',
                })
                return null;
            } finally {
                patchState(store, {
                    loading: false,
                })
            }
        },
        getBlockByIndex(period: number, index: number) {
            patchState(store, {
                loading: true,
            });
            try {
                const meritOrder= this.getMeritOrderByPeriod(period) || null;
                if (!meritOrder || meritOrder.blocks.length <= index) {
                    return; //possivelmente mandar erro aqui
                }
                return meritOrder.blocks[index];
            } catch (error) {
                patchState(store, {
                    error: 'error getting block',
                })
                return null;
            } finally {
                patchState(store, {
                    loading: false,
                })
            }
        }
    }))

)
