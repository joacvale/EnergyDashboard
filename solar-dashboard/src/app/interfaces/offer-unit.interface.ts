export type QuarterField =
    | 'volume'
    | 'price'
    | 'netPosition'
    | 'damPrice'
    | 'idle';

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

export interface Cell{
    id:string,
    offerUnitId:string,
    quarterNumber:number,
    field: QuarterField,
    value?: number|boolean,
}


