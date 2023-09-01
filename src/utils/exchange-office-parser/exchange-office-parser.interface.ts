export interface IExchangeOffice {
  id: number;
  name: string;
  country: string;
  exchanges: IExchange[];
  rates: IRate[];
}

export interface IExchange {
  from: string;
  to: string;
  ask: number;
  date: Date;
}

export interface IRate {
  from: string;
  to: string;
  in: number;
  out: number;
  reserve: number;
  date: Date;
}

export interface ICountry {
  code: string;
  name: string;
}

export interface IExchangeOfficeParserResult {
  exchangeOffices: IExchangeOffice[];
  countries: ICountry[];
}

export interface IExchangeOfficeParser {
  parse(): Promise<IExchangeOfficeParserResult>;
}
