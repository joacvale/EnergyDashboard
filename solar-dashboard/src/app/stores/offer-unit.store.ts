import { inject } from '@angular/core';
import {patchState,signalStore, withMethods, withState} from '@ngrx/signals';
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
  originalData:[],
  editedValues: {},
  loading: false,
  error: null,
};

export const OfferUnitStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store, solarPanelService = inject(SolarPanelService)) => ({
    loadOfferUnits: async()=>{
        patchState(store, {
            loading:true,
            error:null
        });

        try{
            const country = solarPanelService.selectedCountry();
            const response = await firstValueFrom( solarPanelService.getOfferUnits() );
            const filteredData = response.data.filter(
                ou => ou.country === country
            );
            patchState(store, {
                tableData: structuredClone(filteredData),
                originalData: structuredClone(filteredData),
            });
        }catch(error){
            patchState(store, {
                error: 'Failed to load offer units',
            });
        }finally{
            patchState(store,{
                loading:false,
            });
        }
    },
    updateCell (offerUnitId:string, quarterNumber: number, field:QuarterField, value:number){
        patchState(store, {
            loading:true,
            error:null
        })
        try{
            const updatedTableData = structuredClone(store.tableData());
            const offerUnit = updatedTableData.find(ou => ou.id === offerUnitId);
            const selectedQuarter = offerUnit?.quarters.find(q => q.quarter === quarterNumber);
            if (selectedQuarter){
                selectedQuarter[field]=value;
            }
            patchState(store, {
                tableData:updatedTableData
            });
            console.log(updatedTableData);
        }catch(error){
            patchState(store, {
                error:'Failed to update cell',
            })
        }finally{
            patchState(store, {
                loading:false,
            })
        }

    }

    

  }))


);