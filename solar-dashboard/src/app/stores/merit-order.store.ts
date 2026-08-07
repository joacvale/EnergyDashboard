import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface MeritOrderState {

};

const initialState: MeritOrderState = {

};

export const MeritOrderStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),

)