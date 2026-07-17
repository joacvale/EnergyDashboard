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
    country: string;
    type: 'production' | 'limited' | 'idle';
}

export interface CountryData {
    code: string;
    name: string;
}

export interface EnergyPriceData {
  hour: number;
  country: string;
  price: number;
}