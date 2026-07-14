import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductionData, SolarPanel } from '../interfaces/solar-panel.interface';
import { firstValueFrom } from 'rxjs';


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
    loading = signal<boolean>(false); //loading state - default false
    error = signal<string | null>(null); //error state - default null

    //two computed properties
    getTotalProduction = computed(() =>
        this.panels()
        .reduce((total, panel) => total + panel.todayProduction, 0)
    );

    getActivePanelsCount = computed(() =>
        this.panels().filter(panel => panel.status === 'Active').length
    );




    //get all panels
    async loadPanels(filter?:string) {
        this.error.set(null);
        this.loading.set(true);

        try{
            let params = new HttpParams();
            console.log('Filter:', filter);
            if (filter?.trim()){
                params = params.set('location', filter);
            }
            console.log(params.toString());
            const response = await firstValueFrom(
                this.http.get<ApiResponse<SolarPanel[]>>(`${this.apiUrl}/panels`,
                {params}
                )
            );

            this.panels.set(response.data);
            console.log(`Loaded ${response.data.length} panels`);

        }catch (error){
            this.error.set('Failed to load solar panels');
            console.error(error);
        }finally{
            this.loading.set(false);
        }
    }

    //get all production data
    async loadProductionData() {
        this.error.set(null);
        this.loading.set(true);

        try {
            const response = await firstValueFrom(
                this.http.get<ApiResponse<ProductionData[]>>(`${this.apiUrl}/production`)
            );
            this.productionData.set(response.data);
            console.log(`Loaded ${response.data.length} production data entries`);
        }catch (error){
            this.error.set('Failed to load production data');
            console.error(error);
        }finally{
            this.loading.set(false);
        }

    }

    //add panel
    async addPanel(panel: Omit<SolarPanel, 'id'>) {
        this.error.set(null);
        this.loading.set(true);

        try {
            const newPanel = await firstValueFrom(
                this.http.post<SolarPanel>(`${this.apiUrl}/panels` , panel)
            );
            this.panels.update(panels => [
                ...panels, 
                newPanel
            ]);
            console.log('Panel added successfully', newPanel);
            this.loadPanels();

        }catch (error){
            this.error.set('Failed to add solar panel');
            console.error(error);
        }finally{
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
            console.log('Panel updated successfully', updatedPanel);
            this.loadPanels();
        }catch (error){
            this.error.set('Failed to update solar panel');
            console.error(error, ' Panel data:', panel);
        }finally{
            this.loading.set(false);
        }
    }

    //delete panel
    async deletePanel(panelId: string) {
        this.error.set(null);
        this.loading.set(true);
        try {
            // posso tirar a const porque nunca é lida - deixei para uniformizar com os outros métodos
            const deletePanel = await firstValueFrom(
                this.http.delete(`${this.apiUrl}/panels/${panelId}`)
            );
            this.panels.update(panels => panels.filter(p => p.id !== panelId));
            console.log('Panel deleted successfully');
            this.loadPanels();

        }catch (error){
            this.error.set('Failed to delete solar panel');
            console.error(error, ' Panel data:', panelId);
        }finally{
            this.loading.set(false);
        }
    }
    //TODO - check if necessary
    constructor() {
        this.loadPanels();
        this.loadProductionData();
    }

}
