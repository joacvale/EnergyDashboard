import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { MeritOrderService } from '../services/merit-order.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';



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

export interface tsoUp {
    period: number;
    volume: number;
}
export interface tsoUpWithPrice {
    period: number;
    volume?: number;
    price?: number|undefined;
}

export interface MeritOrderState {
    meritOrderTable: MeritOrder[];
    meritOrderOriginal: MeritOrder[];
    tsoUpTable: tsoUpWithPrice[];
    tsoUp95Table: tsoUpWithPrice[];
    tsoUp105Table: tsoUpWithPrice[];
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
    tsoUpTable: [],
    tsoUp95Table: [],
    tsoUp105Table: [],
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

    withComputed((store) => ({
        getMeritOrderTable: computed(() =>
            store.meritOrderTable
        ),

        maxPeriodValue: computed(() =>
            Math.max(...store.meritOrderTable().map(mo => mo.blocks.reduce((sum, block) => sum + (block.programValue || 0), 0)))
        ),
    })),

    
    withMethods((store, meritOrderService = inject(MeritOrderService)) => ({
        loadMeritOrder: async () => {
            patchState(store, {
                meritOrderTable: [],
                meritOrderOriginal: [],
                tsoUpTable: [],
                tsoUp95Table: [],
                tsoUp105Table: [],
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
                const tsoUpTable = data.content.referenceValues[0].tsoUp;
                //console.log (meritOrderData);
                patchState(store, {
                    meritOrderTable: structuredClone(meritOrderData),
                    meritOrderOriginal: structuredClone(meritOrderData),
                    tsoUpTable: structuredClone(tsoUpTable),
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
        changeBlocksPositions(period: number, sourceIndex: number, targetIndex: number) {
            const updatedMeritOrderTable = structuredClone(store.meritOrderTable());
            const meritOrder = updatedMeritOrderTable.find(mo => mo.period === period);


            if (!meritOrder) {
                return;
            }
            //console.log(meritOrder.blocks.map(b => b.label));
            moveItemInArray(meritOrder.blocks, sourceIndex, targetIndex);
            //console.log(meritOrder.blocks.map(b => b.label));
            //console.log('prev ' + meritOrder.blocks[targetIndex].programValue)
            meritOrder.blocks[targetIndex].offerPrice = this.incrementOfferPrice(meritOrder.blocks[targetIndex], meritOrder.blocks[targetIndex + 1]);
            //console.log('after ' + meritOrder.blocks[targetIndex].programValue)
            patchState(store, {
                meritOrderTable: updatedMeritOrderTable,
                lastUpdate: new Date(),
            });
        },
        incrementOfferPrice(changedBlock: Block, bellowBlock: Block | null): number {

            if (!bellowBlock || bellowBlock.programValue === 0) {
                return changedBlock.offerPrice;
            }
            return bellowBlock.offerPrice + store.increment();
        },
        nullProgramValueCountPerPeriod(period: number) {
            const meritOrder = store.meritOrderTable().find(mo => mo.period === period);
            const blocks = meritOrder?.blocks;

            //console.log(blocks?.filter(b => b.programValue === 0 || b.programValue === null || b.programValue === undefined).length);
            return blocks?.filter(b => b.programValue === 0 || b.programValue === null || b.programValue === undefined).length ?? 0;
        },

        periodProgramValue(period: number): number {
            const meritOrder = store
                .meritOrderTable()
                .find(mo => mo.period === period);

            if (!meritOrder) {
                return 0;
            }

            return meritOrder.blocks.reduce(
                (sum, block) => sum + (block.programValue || 0),
                0
            );
        },
        blockHeight(period: number, programValue: number) {
            if (!programValue) {
                return 15;
            }

            const nullValues = this.nullProgramValueCountPerPeriod(period) ?? 0;
            const reservedHeight = nullValues * 15;
            const availableHeight = 600 - reservedHeight;

            return (programValue * availableHeight / store.maxPeriodValue());
        },
        findBlock(period: number, referenceValue: number): Block | null {
            const meritOrder = structuredClone(store.meritOrderTable().find(mo => mo.period === period));

            if (!meritOrder) {
                return null;
            }
            let sum = 0;
            const reversedBlocks = meritOrder.blocks.reverse();
            for (const block of reversedBlocks) {
                sum += block.programValue;
                if (sum >= referenceValue) {
                    if(period===13){
                        console.log('refValue - '+referenceValue+' label - '+block.label+' vol - '+ block.programValue);
                    }
                    return block;
                }
            }
            return null;
        },
        calcTsoUp95() {
            try {
                const table = structuredClone(store.tsoUpTable());
                let table95: tsoUpWithPrice[]=[];
                let newTso: tsoUpWithPrice;
                table.forEach(row => {
                    const referenceTso = store.tsoUpTable().find(tso => tso.period === row.period)
                    if (!referenceTso || !referenceTso.volume) {
                        newTso = {period:row.period, volume: 0, price: 0};
                    } else {
                        const referenceValue = referenceTso.volume * 0.95;
                        const newBlock = this.findBlock(row.period, referenceValue);
                        newTso = {period:row.period, volume:newBlock?.programValue, price:newBlock?.offerPrice};
                    }
                    table95= [...table95,newTso];
                });
                patchState(store, {
                    tsoUp95Table: table95
                })
            } catch (error) {
                patchState(store, {
                    error: 'error calc table95'
                })
            }
        },
                
        calcTsoUp105() {
            try {
                const table = structuredClone(store.tsoUpTable());
                let table105: tsoUpWithPrice[]=[];
                let newTso: tsoUpWithPrice;
                table.forEach(row => {
                    const referenceTso = store.tsoUpTable().find(tso => tso.period === row.period)
                    if (!referenceTso || !referenceTso.volume) {
                        newTso = {period:row.period, volume: 0, price: 0};
                    } else {
                        const referenceValue = referenceTso.volume * 1.05;
                        const newBlock = this.findBlock(row.period, referenceValue);
                        newTso = {period:row.period, volume:newBlock?.programValue, price:newBlock?.offerPrice};
                    }
                    table105= [...table105,newTso];
                });
                patchState(store, {
                    tsoUp105Table: table105
                })
            } catch (error) {
                patchState(store, {
                    error: 'error calc table95'
                })
            }
        },
    })),




)
