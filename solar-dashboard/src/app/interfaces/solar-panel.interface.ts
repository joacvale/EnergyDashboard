export interface SolarPanel {
    id: string; 
    location: string; 
    capacity: number; 
    todayProduction: number; 
    status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface ProductionData {
    hour:number;
    production:number;
    type: 'production' | 'limited' | 'idle';
}
