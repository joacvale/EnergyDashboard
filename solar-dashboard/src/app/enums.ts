export enum ViewMode {
  TABLE = 'table',
  CHART = 'chart',
}

export enum DialogMode {
  ADD = 'add',
  EDIT = 'update',
  DELETE = 'delete',
}


export enum CountryCode {
  PORTUGAL = 'PT',
  SPAIN = 'ES',
  FRANCE = 'FR',
  ITALY = 'IT',
}

export const COUNTRIES = [
  {code: CountryCode.PORTUGAL,name: 'Portugal'},
  {code: CountryCode.SPAIN,name: 'Spain'},
  {code: CountryCode.FRANCE,name: 'France'},
  {code: CountryCode.ITALY,name: 'Italy'}
];
