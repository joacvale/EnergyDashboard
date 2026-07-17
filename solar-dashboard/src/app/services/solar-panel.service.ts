import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductionData, SolarPanel, EnergyPriceData, CountryData } from '../interfaces/solar-panel.interface';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class SolarPanelService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api';

    //four signals for state management
    panels = signal<SolarPanel[]>([]); //list of solar panels - default empty array
    productionData = signal<ProductionData[]>([]); //list of production data - default empty array
    energyPriceData = signal<EnergyPriceData[]>([]); //list of energy price data - default empty array~
    countryData = signal<CountryData[]>([]);
    selectedCountry = signal<string>('');

    loading = signal<boolean>(false); //loading state - default false
    error = signal<string | null>(null); //error state - default null

    //two computed properties
    getTotalProduction = computed(() =>
        this.panels().reduce((total, panel) => total + panel.todayProduction, 0)
    );

    getActivePanelsCount = computed(() =>
        this.panels().filter(panel => panel.status === 'Active').length
    );

    //get all panels
    async loadPanels() {
        this.error.set(null);
        this.loading.set(true);

        try {
            const country=this.selectedCountry();

            let params = new HttpParams();
            const response = await firstValueFrom(
                this.http.get<ApiResponse<SolarPanel[]>>(`${this.apiUrl}/panels`,
                    { params }
                )
            );
            const filteredData = response.data.filter(panels => panels.country === country);

            this.panels.set(filteredData);

        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                this.error.set(`Server error: ${error.status} ${error.message}`);
            } else if (error instanceof Error) {
                this.error.set(`Error: ${error.message}`);
            } else {
                this.error.set('Unknown error occurred');
            }
        } finally {
            this.loading.set(false);
        }
    }

    //get all production data
    async loadProductionData() {
        this.error.set(null);
        this.loading.set(true);

        try {
            const country=this.selectedCountry();
            const response = await firstValueFrom(
                this.http.get<ApiResponse<ProductionData[]>>(`${this.apiUrl}/production`)
            );
            const filteredData = response.data.filter(productionData => productionData.country === country);
            this.productionData.set(filteredData);
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                this.error.set(`Server error: ${error.status} ${error.message}`);
            } else if (error instanceof Error) {
                this.error.set(`Error: ${error.message}`);
            } else {
                this.error.set('Unknown error occurred');
            }
        } finally {
            this.loading.set(false);
        }

    }

    //get all energy price
    async loadEnergyPriceData() {
        this.error.set(null);
        this.loading.set(true);
        try {
            const country=this.selectedCountry();
            const response = await firstValueFrom(
                this.http.get<ApiResponse<EnergyPriceData[]>>(`${this.apiUrl}/energy-prices`)
            );
            const filteredData = response.data.filter(energyPrice => energyPrice.country === country);
            this.energyPriceData.set(filteredData);
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                this.error.set(`Server error: ${error.status} ${error.message}`);
            } else if (error instanceof Error) {
                this.error.set(`Error: ${error.message}`);
            } else {
                this.error.set('Unknown error occurred');
            }
        } finally {
            this.loading.set(false);
        }
    }

    //get all countries
    async loadCountryData() {
        this.error.set(null);
        this.loading.set(true);
        try {
            const response = await firstValueFrom(
                this.http.get<ApiResponse<CountryData[]>>(`${this.apiUrl}/countries`)
            );
            this.countryData.set(response.data);
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                this.error.set(`Server error: ${error.status} ${error.message}`);
            } else if (error instanceof Error) {
                this.error.set(`Error: ${error.message}`);
            } else {
                this.error.set('Unknown error occurred');
            }
        } finally {
            this.loading.set(false);
        }
    }



    //add panel
    async addPanel(panel: Omit<SolarPanel, 'id'>) {
        this.error.set(null);
        this.loading.set(true);
        try {
            const newPanel = await firstValueFrom(
                this.http.post<SolarPanel>(`${this.apiUrl}/panels`, panel)
            );
            this.panels.update(panels => [
                ...panels,
                newPanel
            ]);
            await this.loadPanels();
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                this.error.set(`Server error: ${error.status} ${error.message}`);
            } else if (error instanceof Error) {
                this.error.set(`Error: ${error.message}`);
            } else {
                this.error.set('Unknown error occurred');
            }
        } finally {
            this.loading.set(false);
        }
    }

    //update panel
    async updatePanel(panel: SolarPanel) {
        this.error.set(null);
        this.loading.set(true);
        try {
            const updatedPanel = await firstValueFrom(
                this.http.put<SolarPanel>(`${this.apiUrl}/panels/${panel.id}`, panel)
            );
            this.panels.update(
                panels => panels.map(p => p.id === panel.id ? updatedPanel : p)
            );
            await this.loadPanels();
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                this.error.set(`Server error: ${error.status} ${error.message}`);
            } else if (error instanceof Error) {
                this.error.set(`Error: ${error.message}`);
            } else {
                this.error.set('Unknown error occurred');
            }
        } finally {
            this.loading.set(false);
        }
    }

    //delete panel
    async deletePanel(panelId: string) {
        this.error.set(null);
        this.loading.set(true);
        try {
            await firstValueFrom(
                this.http.delete(`${this.apiUrl}/panels/${panelId}`)
            );
            this.panels.update(panels => panels.filter(p => p.id !== panelId));
            await this.loadPanels();
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                this.error.set(`Server error: ${error.status} ${error.message}`);
            } else if (error instanceof Error) {
                this.error.set(`Error: ${error.message}`);
            } else {
                this.error.set('Unknown error occurred');
            }
        } finally {
            this.loading.set(false);
        }
    }

    async setCountry(countryId: string){
        this.selectedCountry.set(countryId);
        this.loadPanels();
        this.loadProductionData();
        this.loadEnergyPriceData();
        this.loadCountryData();
    }

    constructor() {
        this.selectedCountry.set('ES');
        this.loadPanels();
        this.loadProductionData();
        this.loadEnergyPriceData();
        this.loadCountryData();
    }

}
