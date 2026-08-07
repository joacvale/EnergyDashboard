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
    increment: number;
    loading: boolean;
    error: string | null;
    lastUpdate: Date;
};

const initialState: MeritOrderState = {
    meritOrderTable: [],
    meritOrderOriginal: [],
    selectedBlock: null,
    selectedMeritOrder: null,
    increment: 0,
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
                increment: 0,
                loading: true,
                error: null,
                lastUpdate: new Date(),
            })
            try {
                const increment = await meritOrderService.getIncrement();
                const data = await meritOrderService.getMeritOrder();
                const meritOrderData = data.content.meritOrder[0].upPriceMeritOrder;
                //console.log (meritOrderData);
                patchState(store, {
                    meritOrderTable: meritOrderData,
                    meritOrderOriginal: meritOrderData,
                    increment: increment,
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
                const index = period - 1;
                const meritOrder: MeritOrder = store.meritOrderTable()[index];
                if (!meritOrder) {
                    return null;
                }
                //console.log(meritOrder);
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
        getBlockByIndex(period: number, blockIndex: number) {
            patchState(store, {
                loading: true,
            });
            try {
                const index = blockIndex - 1;
                const meritOrder = this.getMeritOrderByPeriod(period) || null;
                if (!meritOrder || meritOrder.blocks.length <= index) {
                    return; //possivelmente mandar erro aqui
                }
                //console.log(meritOrder.blocks[index]);
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
        },
        incrementProgramValue(meritOrder: MeritOrder, changedBlock: Block) {
            patchState(store, {
                loading: true,
            });
            try {
                //console.log('program value inicial '+ changedBlock.programValue);
                const updatedMeritOrderTable: MeritOrder[] = structuredClone(store.meritOrderTable());
                const updatedMeritOrderIndex = updatedMeritOrderTable.findIndex(mo => mo.period === meritOrder.period);
                const updatedMeritOrder = updatedMeritOrderTable.find(mo => mo.period === meritOrder.period);
                const changedBlockIndex = updatedMeritOrder?.blocks.findIndex(block => block.label === changedBlock.label);
                if (changedBlockIndex && changedBlockIndex>0) {
                    const previousBlock = updatedMeritOrder?.blocks[changedBlockIndex -1];
                    if (previousBlock) {
                        //console.log('previous block program value '+previousBlock.programValue);
                        changedBlock.programValue = previousBlock.programValue + store.increment();
                        updatedMeritOrder.blocks[changedBlockIndex] = changedBlock;
                        updatedMeritOrderTable[updatedMeritOrderIndex] = updatedMeritOrder;
                        //console.log('final '+ updatedMeritOrderTable[updatedMeritOrderIndex].blocks[changedBlockIndex].programValue);
                        patchState(store, {
                            meritOrderTable: updatedMeritOrderTable,
                            lastUpdate: new Date(),
                        })
                    }
                }
            } catch (error) {
                patchState(store, {
                    error: 'error incrementing program value',
                })
            } finally {
                patchState(store, {
                    loading: false,
                })
            }
        }
    }))

)
