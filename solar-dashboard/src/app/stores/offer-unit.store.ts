import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { SolarPanelService } from '../services/solar-panel.service';
import { OfferUnit } from '../interfaces/offer-unit.interface';
import { firstValueFrom } from 'rxjs';


type QuarterField =
    | 'volume'
    | 'price'
    | 'netPosition'
    | 'damPrice';

export interface OfferUnitState {
    tableData: OfferUnit[];
    originalData: OfferUnit[];
    editedValues: Record<string, any>;
    loading: boolean;
    error: string | null;
};

const initialState: OfferUnitState = {
    tableData: [],
    originalData: [],
    editedValues: {},
    loading: false,
    error: null,
};

export const OfferUnitStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),

    withMethods((store, solarPanelService = inject(SolarPanelService)) => ({
        loadOfferUnits: async () => {
            patchState(store, {
                loading: true,
                error: null
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
                    error: 'Failed to load offer units',
                });
            } finally {
                patchState(store, {
                    loading: false,
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
            } catch (error) {
                patchState(store, {
                    error: 'Failed to update cell',
                })
            } 
        },
        updateEditedValues(offerUnitId: string, quarterNumber: number, field: QuarterField, value: number) {
            patchState(store, {
                error: null
            })
            try {
                const id = offerUnitId + '-' + quarterNumber + '-' + field;
                const editedValues2 = structuredClone(store.editedValues());


                const originalData = store.originalData();
                const originalOu = originalData.find(ou => ou.id === offerUnitId);
                const originalQ = originalOu?.quarters.find(q => q.quarter === quarterNumber);

                console.log(  originalQ);
                console.log(  value);
                if (originalQ) {
                    if (originalQ[field] === value) {
                        delete editedValues2[id],
                        patchState(store, {
                            editedValues: editedValues2,
                        });
                    } else {
                        editedValues2[id] = value
                        patchState(store, {
                            editedValues: editedValues2,
                        });
                    }
                }

                console.log(editedValues2)

            } catch (error) {
                patchState(store, {
                    error: 'Failed to update editedValues'
                })
            } 
        }



    }))


);