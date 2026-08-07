import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { SolarPanelService } from '../services/solar-panel.service';
import { OfferUnit, Cell, QuarterField, OfferUnitQuarter } from '../interfaces/offer-unit.interface';
import { firstValueFrom, last } from 'rxjs';


type loadingStatus =
    | 'idle'
    | 'loading-offer-units';

type errorType =
    | 'error loading data'
    | 'error updating data'
    | 'error cleaning data'
    | 'error updating editedValues array'
    | 'error updating errorValues array'
    | 'error updating selected cells'
    | 'error activating cells'
    | 'error unknown'

export interface error {
    id: string;
    error: errorType;
}



export interface OfferUnitState {
    tableData: OfferUnit[];
    originalData: OfferUnit[];
    editedValues: Record<string, any>;
    errorValues: Record<string, { id: string; message: string; }>;
    selectedCells: Cell[];
    activeCell: Cell | null;
    loading: loadingStatus;
    error: error | null;
    lastUpdate: Date;
};

const initialState: OfferUnitState = {
    tableData: [],
    originalData: [],
    editedValues: {},
    errorValues: {},
    selectedCells: [],
    activeCell: null,
    loading: 'idle',
    error: null,
    lastUpdate: new Date(),
};

export const OfferUnitStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),

    withMethods((store, solarPanelService = inject(SolarPanelService)) => ({
        loadOfferUnits: async () => {
            patchState(store, {
                loading: 'loading-offer-units',
                error: null,
                editedValues: {},
                errorValues: {},
                selectedCells: [],
                activeCell: null,
                lastUpdate:new Date(),
            });

            try {
                const country = solarPanelService.selectedCountry();
                const response = await firstValueFrom(solarPanelService.getOfferUnits());
                const filteredData = response.data.filter(
                    ou => ou.country === country
                );
                patchState(store, {
                    tableData: structuredClone(filteredData),
                    originalData: structuredClone(filteredData),
                });
            } catch (error) {
                patchState(store, {
                    error: {
                        id: "load",
                        error: 'error loading data',
                    }
                });
            } finally {
                patchState(store, {
                    loading: 'idle',
                });
            }
        },
        updateCell(cell: Cell) {
            patchState(store, {
                error: null
            })
            try {
                const updatedTableData = structuredClone(store.tableData());
                const offerUnit = updatedTableData.find(ou => ou.id === cell.offerUnitId);
                const selectedQuarter = offerUnit?.quarters.find(q => q.quarter === cell.quarterNumber);
                if (selectedQuarter && cell.field != 'idle') {
                    selectedQuarter[cell.field] = Number(cell.value);
                } else if (selectedQuarter && cell.field === 'idle') {
                    if (cell.value) {
                        selectedQuarter[cell.field] = true;
                    } else {
                        selectedQuarter[cell.field] = false;
                    }

                }
                this.updateEditedValues(cell);
                this.updateErrorValues(cell);
                patchState(store, {
                    tableData: updatedTableData,
                    lastUpdate: new Date(),
                });
            } catch (error) {
                patchState(store, {
                    error: {
                        id: cell.id,
                        error: 'error updating data',

                    }
                })
            }
        },
        updateEditedValues(cell: Cell) {
            patchState(store, {
                error: null
            })
            try {
                const id = cell.id;
                const editedValuesCopy = structuredClone(store.editedValues());

                const originalData = store.originalData();
                const originalOfferUnit = originalData.find(ou => ou.id === cell.offerUnitId);
                const originalQuarter = originalOfferUnit?.quarters.find(q => q.quarter === cell.quarterNumber);


                if (originalQuarter) {
                    if (originalQuarter[cell.field] === cell.value) {
                        delete editedValuesCopy[id],
                            patchState(store, {
                                editedValues: editedValuesCopy,
                            });
                    } else {
                        editedValuesCopy[id] = cell.value
                        patchState(store, {
                            editedValues: editedValuesCopy,
                        });
                        if(cell.field==='idle' && !originalQuarter[cell.field] && cell.value===false){
                            delete editedValuesCopy[id],
                            patchState(store, {
                                editedValues: editedValuesCopy,
                            });
                        }
                    }
                }
            } catch (error) {
                patchState(store, {
                    error: {
                        id: cell.id,
                        error: 'error updating editedValues array'
                    }
                })
            }
        },
        isCellEdited(cellId: string) {
            const id = cellId;
            return id in store.editedValues();
        },
        isInCross(cell: Cell) {
            const selectedCell = store.activeCell();

            if (!selectedCell) {
                return false;
            }
            if (selectedCell.offerUnitId === cell.offerUnitId && (selectedCell.quarterNumber === cell.quarterNumber || selectedCell.field === cell.field)) {
                return true;
            }
            return false;
        },
        isCellBlocked(offerUnitId: string, quarter:number): boolean{
            const tableData = store.tableData();
            const idle = tableData.find(ou => ou.id === offerUnitId)?.quarters.find(q => q.quarter === quarter)?.idle
            if(idle){
                return idle;
            }
            return false;
        },
        clearChanges(offerUnitId: string) {
            try {
                const updatedTableData = structuredClone(store.tableData());
                const originalOfferUnit = store.originalData().find(ou => ou.id === offerUnitId);

                const index = updatedTableData.findIndex(ou => ou.id === offerUnitId);
                if (index >= 0 && originalOfferUnit) {
                    updatedTableData[index] = structuredClone(originalOfferUnit);
                }

                const editedValuesCopy = structuredClone(store.editedValues());
                Object.keys(editedValuesCopy).forEach(key => {
                    if (key.startsWith(`${offerUnitId}-`)) {
                        delete editedValuesCopy[key];
                    }
                });

                const errorValuesCopy = structuredClone(store.errorValues());
                Object.keys(errorValuesCopy).forEach(key => {
                    if (key.startsWith(`${offerUnitId}-`)) {
                        delete errorValuesCopy[key];
                    }
                });

                patchState(store, {
                    tableData: updatedTableData,
                    editedValues: editedValuesCopy,
                    errorValues: errorValuesCopy
                });
            } catch {
                patchState(store, {
                    error: {
                        id: 'clear',
                        error: 'error cleaning data'
                    }
                });
            }
        },
        updateErrorValues(cell: Cell) {
            patchState(store, {
                error: null,
            });
            try {
                const updatedErrorValues = structuredClone(store.errorValues())
                if (this.getError(Number(cell.value))) {
                    updatedErrorValues[cell.id] = {
                        id: cell.id,
                        message: 'In ' + cell.offerUnitId + ' the value of ' + cell.field + ' on H' + (Math.floor((cell.quarterNumber - 1) / 4) + 1) + ' Q' + cell.quarterNumber + ' has: ' + this.getError(Number(cell.value))
                    }; patchState(store, {
                        errorValues: updatedErrorValues
                    })
                } else {
                    if (updatedErrorValues[cell.id]) {
                        delete updatedErrorValues[cell.id];
                        patchState(store, {
                            errorValues: updatedErrorValues,
                        });
                    }
                }
            } catch (error) {
                patchState(store, {

                })
            }
        },
        updateSelectedCells(value: number | boolean) {
            patchState(store, {
                error: null,
            })
            try {
                store.selectedCells().forEach(cell => {
                    if(this.isCellBlocked(cell.offerUnitId, cell.quarterNumber)){
                        return;
                    }
                    const updatedCell = structuredClone(cell);
                    updatedCell.value = value;
                    this.updateCell(updatedCell);
                });
                patchState(store, {
                    selectedCells: [],
                })
            }
            catch (error) {
                patchState(store, {
                    error: {
                        id: 'selected-cells',
                        error: 'error updating selected cells',
                    }
                })
            }
        },
        getError(value: number) {
            if (value > 99999.99) {
                return "6 or more characters";
            }
            return false;
        },
        toggleSelectedCell(cell: Cell) {
            const selectedArray = structuredClone(store.selectedCells());
            const index = selectedArray.findIndex(c => c.id === cell.id);
            if (index >= 0) {
                selectedArray.splice(index, 1);
            } else {
                selectedArray.push(cell);
            }
            patchState(store, {
                selectedCells: selectedArray
            });
        },
        selectManyCells(initialCell: Cell, lastCell: Cell) {
            if (initialCell.offerUnitId !== lastCell.offerUnitId) {
                return;
            }

            this.clearSelectedCells();
            const offerUnitId = initialCell.offerUnitId;

            const fieldOrder: QuarterField[] = [
                'volume',
                'price',
                'netPosition',
                'damPrice',
                'idle'
            ];

            const startQuarter = Math.min(initialCell.quarterNumber, lastCell.quarterNumber);
            const endQuarter = Math.max(initialCell.quarterNumber, lastCell.quarterNumber);
            const startField = Math.min(fieldOrder.indexOf(initialCell.field), fieldOrder.indexOf(lastCell.field));
            const endField = Math.max(fieldOrder.indexOf(initialCell.field), fieldOrder.indexOf(lastCell.field));

            for (let quarterIndex = startQuarter; quarterIndex <= endQuarter; quarterIndex++) {
                for (let fieldIndex = startField; fieldIndex <= endField; fieldIndex++) {
                    const cell: Cell = {
                        id: offerUnitId + '-' + quarterIndex + '-' + fieldOrder[fieldIndex],
                        offerUnitId: offerUnitId,
                        quarterNumber: quarterIndex,
                        field: fieldOrder[fieldIndex],
                    };
                    this.toggleSelectedCell(cell);
                }
            }
        },
        isCellSelected(id: string) {
            if (store.selectedCells().findIndex(c => c.id === id) >= 0) {
                return true;
            }
            return false;
        },
        clearSelectedCells() {
            patchState(store, {
                selectedCells: [],
            })
        },
        setCellActive(cell: Cell) {
            try {
                patchState(store, {
                    activeCell: cell,
                })
            } catch (error) {
                patchState(store, {
                    error: {
                        id: cell.id,
                        error: 'error activating cells',
                    }
                })
            }
        },
        getVolumeDataPerQuarter(offerUnit: OfferUnit): (number | null)[] {
            const volumeData: (number | null)[] = [];
            offerUnit.quarters.forEach((quarter: OfferUnitQuarter) => {

                volumeData[quarter.quarter] = quarter.volume || null;

            });
            return volumeData;
        },
        getPriceDataPerQuarter(offerUnit: OfferUnit): (number | null)[] {
            const priceData: (number | null)[] = [];
            offerUnit.quarters.forEach((quarter: OfferUnitQuarter) => {

                priceData[quarter.quarter] = quarter.price || null;

            });
            return priceData;
        },
        getIsIdle(offerUnit: OfferUnit, quarterNumber: number): number {
            const quarter = offerUnit.quarters.find(q => q.quarter === quarterNumber);
            if (quarter?.idle) {
                return 1;
            } else {
                return 0;
            }

        }
    })),

    withComputed((store) => ({
        modifiedCellsCount: computed(() =>
            Object.keys(store.editedValues()).length
        ),
        getErrorMessages: computed(() =>
            Object.values(store.errorValues())
        ),
    }))


);