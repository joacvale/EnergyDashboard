import { inject } from '@angular/core';
import {patchState,signalStore, withMethods, withState} from '@ngrx/signals';
import { SolarPanelService } from '../services/solar-panel.service';
import { OfferUnit } from '../interfaces/offer-unit.interface';
import { firstValueFrom } from 'rxjs';

export interface OfferUnitState {
  tableData: OfferUnit[];
  loading: boolean;
  error: string | null;
};

const initialState: OfferUnitState = {
  tableData: [],
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
                tableData: filteredData,
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
    }
  }))


);