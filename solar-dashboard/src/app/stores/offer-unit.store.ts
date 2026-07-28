import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { SolarPanelService } from '../services/solar-panel.service';
import { OfferUnit, Cell, QuarterField } from '../interfaces/offer-unit.interface';
import { firstValueFrom } from 'rxjs';


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
    | 'error unknown'

export interface error {
    id: string;
    error: errorType;
}



export interface OfferUnitState {
    tableData: OfferUnit[];
    originalData: OfferUnit[];
    editedValues: Record<string, any>;
    errorValues: Record<string, any>;
    selectedCells: Cell[];
    loading: loadingStatus;
    error: error | null;
};

const initialState: OfferUnitState = {
    tableData: [],
    originalData: [],
    editedValues: {},
    errorValues: {},
    selectedCells: [],
    loading: 'idle',
    error: null,
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
                selectedCells:[],
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
                if (selectedQuarter) {
                    selectedQuarter[cell.field] = Number(cell.value);
                }
                patchState(store, {
                    tableData: updatedTableData
                });
                this.updateEditedValues(cell);
                this.updateErrorValues(cell);
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
                    updatedErrorValues[cell.id] = 'In '+cell.offerUnitId+' the value of ' + cell.field + ' on H'+ (Math.floor((cell.quarterNumber - 1) / 4) + 1)+' Q'+cell.quarterNumber+' has: ' + this.getError(Number(cell.value));
                    patchState(store, {
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
        updateSelectedCells(value:number) {
            patchState(store, {
                error: null,
            })
            try {
                store.selectedCells().forEach(cell => {
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
        isCellSelected(id:string){
            if(store.selectedCells().findIndex(c=>c.id === id)>=0){
                return true;
            }
            return false;
        },
        clearSelectedCells(){
            patchState(store,{
                selectedCells:[],
            })
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