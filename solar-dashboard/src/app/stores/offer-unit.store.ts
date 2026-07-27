import { inject,computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
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
    errorValues: Record<string, any>;
    loading: boolean;
    error: string | null;
};

const initialState: OfferUnitState = {
    tableData: [],
    originalData: [],
    editedValues: {},
    errorValues:{},
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
                error: null,
                editedValues:{},
                errorValues:{},
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
                this.updateErrorValues(offerUnitId,quarterNumber, field,value);
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
                    error: 'Failed to update editedValues'
                })
            }
        },
        isCellEdited(offerUnitId: string, quarterNumber: number, field: QuarterField) {
            const id = offerUnitId + '-' + quarterNumber + '-' + field;
            return id in store.editedValues();
        },
        clearChanges() {
            patchState(store, {
                error: null,
            })
            try {
                patchState(store, {
                    tableData: structuredClone(store.originalData()),
                    editedValues: {},
                    errorValues: {},
                    error: null,
                    loading: false,
                })
            } catch (error) {
                patchState(store, {
                    error: 'Failed to clear changes',
                })
            }
        },
        updateErrorValues(offerUnitId: string, quarterNumber: number, field: QuarterField, value: number){
            patchState(store,{
                error:null,
            });
            const id= offerUnitId+'-'+quarterNumber+'-'+field;
            const updatedErrorValues = structuredClone(store.errorValues())
            if(this.getError(value)){
                updatedErrorValues[id]='The value on '+id+' has: '+ this.getError(value);
                patchState(store,{
                    errorValues:updatedErrorValues
                })
            }else{
                if(updatedErrorValues[id]){
                    delete updatedErrorValues[id];
                    patchState(store, {
                        errorValues:updatedErrorValues,
                    });
                }
            }

        },
        getError(value:number){
            if(value>99999.99){
                return "6 or more characters";
            }
            return false;
        }
    })),

    withComputed((store) => ({
        modifiedCellsCount: computed(() =>
            Object.keys(store.editedValues()).length
        ),
        getErrorMessages: computed(()=>
            Object.values(store.errorValues())
        ),
    }))


);