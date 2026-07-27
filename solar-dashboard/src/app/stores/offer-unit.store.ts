import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { SolarPanelService } from '../services/solar-panel.service';
import { OfferUnit } from '../interfaces/offer-unit.interface';
import { firstValueFrom } from 'rxjs';


type QuarterField =
    | 'volume'
    | 'price'
    | 'netPosition'
    | 'damPrice';

type loadingStatus =
    | 'idle'
    | 'loading-offer-units';

type errorType =
    | 'error loading data'
    | 'error updating data'
    | 'error cleaning data'
    | 'error updating editedValues array'
    | 'error updating errorValues array'
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
    loading: loadingStatus;
    error: error | null;
};

const initialState: OfferUnitState = {
    tableData: [],
    originalData: [],
    editedValues: {},
    errorValues: {},
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
        updateCell(offerUnitId: string, quarterNumber: number, field: QuarterField, value: number) {
            patchState(store, {
                error: null
            })
            try {
                const updatedTableData = structuredClone(store.tableData());
                const offerUnit = updatedTableData.find(ou => ou.id === offerUnitId);
                const selectedQuarter = offerUnit?.quarters.find(q => q.quarter === quarterNumber);
                if (selectedQuarter) {
                    selectedQuarter[field] = Number(value);
                }
                patchState(store, {
                    tableData: updatedTableData
                });
                this.updateEditedValues(offerUnitId, quarterNumber, field, Number(value));
                this.updateErrorValues(offerUnitId, quarterNumber, field, value);
            } catch (error) {
                patchState(store, {
                    error: {
                        id: offerUnitId + '-' + quarterNumber + '-' + field,
                        error: 'error updating data',

                    }
                })
            }
        },
        updateEditedValues(offerUnitId: string, quarterNumber: number, field: QuarterField, value: number) {
            patchState(store, {
                error: null
            })
            try {
                const id = offerUnitId + '-' + quarterNumber + '-' + field;
                const editedValuesCopy = structuredClone(store.editedValues());

                const originalData = store.originalData();
                const originalOfferUnit = originalData.find(ou => ou.id === offerUnitId);
                const originalQuarter = originalOfferUnit?.quarters.find(q => q.quarter === quarterNumber);

                if (originalQuarter) {
                    if (originalQuarter[field] === value) {
                        delete editedValuesCopy[id],
                            patchState(store, {
                                editedValues: editedValuesCopy,
                            });
                    } else {
                        editedValuesCopy[id] = value
                        patchState(store, {
                            editedValues: editedValuesCopy,
                        });
                    }
                }
            } catch (error) {
                patchState(store, {
                    error: {
                        id: offerUnitId + '-' + quarterNumber + '-' + field,
                        error: 'error updating editedValues array'
                    }
                })
            }
        },
        isCellEdited(offerUnitId: string, quarterNumber: number, field: QuarterField) {
            const id = offerUnitId + '-' + quarterNumber + '-' + field;
            return id in store.editedValues();
        },
        clearChanges(offerUnitId: string) {
            try {
                const updatedTableData =structuredClone(store.tableData());
                const originalOfferUnit =store.originalData().find(ou => ou.id === offerUnitId);
                
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
        updateErrorValues(offerUnitId: string, quarterNumber: number, field: QuarterField, value: number) {
            patchState(store, {
                error: null,
            });
            try {
                const id = offerUnitId + '-' + quarterNumber + '-' + field;
                const updatedErrorValues = structuredClone(store.errorValues())
                if (this.getError(value)) {
                    updatedErrorValues[id] = 'The value on ' + id + ' has: ' + this.getError(value);
                    patchState(store, {
                        errorValues: updatedErrorValues
                    })
                } else {
                    if (updatedErrorValues[id]) {
                        delete updatedErrorValues[id];
                        patchState(store, {
                            errorValues: updatedErrorValues,
                        });
                    }
                }
            } catch (error) {
                patchState(store, {
                    error: {
                        id: offerUnitId + '-' + quarterNumber + '-' + field,
                        error: 'error updating errorValues array',
                    }
                })
            }


        },
        getError(value: number) {
            if (value > 99999.99) {
                return "6 or more characters";
            }
            return false;
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