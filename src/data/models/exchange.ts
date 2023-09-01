import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ExchangeOffice } from "./exchange-office";

/* Must be enum */
export type Currency = string;

@Entity()
export class Exchange {
  @PrimaryKey()
  id: number;

  @Property()
  from: Currency;

  @Property()
  to: Currency;

  @Property()
  ask: number;

  @Property({ columnType: "timestamptz", defaultRaw: "now()" })
  date = new Date();

  @ManyToOne(() => ExchangeOffice)
  exchangeOffice: ExchangeOffice;
}
