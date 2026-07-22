export interface OfferUnit{
  id: string;
  name: string;
  country: string;
  quarters: OfferUnitQuarter[];
}

export interface OfferUnitQuarter{
  quarter: number;
  volume?: number;
  price?: number;
  netPosition?: number;
  damPrice?: number;
  idle?: boolean;
}
