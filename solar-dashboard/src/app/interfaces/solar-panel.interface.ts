export interface SolarPanel {
    id: string;
    location: string;
    country?: string;
    capacity: number;
    todayProduction: number;
    status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface ProductionData {
    hour: number;
    production: number;
    type: 'production' | 'limited' | 'idle';
}
/*

export interface Country {
    code: string;
    name: string;
}
*/

export interface EnergyPriceData {
  hour: number;
  cournty: string;
  price: number;
}

