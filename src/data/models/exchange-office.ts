import { Entity, ManyToOne, Property, PrimaryKey, OneToMany, Collection } from "@mikro-orm/core";
import { Country } from "./country";
import { Rate } from "./rate";
import { Exchange } from "./exchange";

export type ExchangeOfficeId = number;

@Entity()
export class ExchangeOffice {
  @PrimaryKey()
  id: ExchangeOfficeId;

  @Property()
  name: string;

  @ManyToOne(() => Country)
  country: Country;

  @OneToMany(() => Exchange, exchange => exchange.exchangeOffice)
  exchanges = new Collection<Exchange>(this);

  @OneToMany(() => Rate, rate => rate.exchangeOffice)
  rates = new Collection<Rate>(this);

  setRates(rates: Rate[]) {
    this.rates.set(rates);
  }

  setExchanges(exchanges: Exchange[]) {
    this.exchanges.set(exchanges);
  }
}
