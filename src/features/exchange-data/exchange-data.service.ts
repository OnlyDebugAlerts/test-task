import { Injectable } from "@nestjs/common";
import { IExchangeOfficeParserResult } from "../../utils/exchange-office-parser/exchange-office-parser.interface";
import { EntityManager } from "@mikro-orm/core";
import { Country } from "../../data/models/country";
import { ExchangeOffice } from "../../data/models/exchange-office";
import { Exchange } from "../../data/models/exchange";
import { Rate } from "../../data/models/rate";

@Injectable()
export class ExchangeDataService {
  constructor(private readonly _em: EntityManager) {}

  async importParsedDataToDB(parsedData: IExchangeOfficeParserResult) {
    const em = this._em.fork();
    const countries = parsedData.countries.map(country => {
      const newCountry = new Country();
      newCountry.code = country.code;
      newCountry.name = country.name;

      return newCountry;
    });

    const exchangeOffices = parsedData.exchangeOffices.map(exchangeOffice => {
      const newExchangeOffice = new ExchangeOffice();
      newExchangeOffice.name = exchangeOffice.name;
      newExchangeOffice.country = countries.find(country => country.code === exchangeOffice.country);

      const rates = exchangeOffice.rates.map(rate => {
        const newRate = new Rate();
        newRate.from = rate.from;
        newRate.to = rate.to;
        newRate.in = rate.in;
        newRate.out = rate.out;
        newRate.reserve = rate.reserve;
        newRate.date = rate.date;

        return newRate;
      });
      newExchangeOffice.setRates(rates);

      const exchanges = exchangeOffice.exchanges.map(exchange => {
        const newExchange = new Exchange();
        newExchange.from = exchange.from;
        newExchange.to = exchange.to;
        newExchange.ask = exchange.ask;
        newExchange.date = exchange.date;

        return newExchange;
      });
      newExchangeOffice.setExchanges(exchanges);

      return newExchangeOffice;
    });

    await em.persistAndFlush(exchangeOffices);
  }
}
