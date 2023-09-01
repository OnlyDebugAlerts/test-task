import { Entity, ManyToOne, Property, PrimaryKey } from "@mikro-orm/core";
import { ExchangeOffice } from "./exchange-office";

export type RateId = number;

@Entity()
export class Rate {
  @PrimaryKey()
  id: RateId;

  @Property()
  from: string;

  @Property()
  to: string;

  @Property()
  in: number;

  @Property()
  out: number;

  @Property()
  reserve: number;

  @Property({ columnType: "timestamptz", defaultRaw: "now()" })
  date = new Date();

  @ManyToOne(() => ExchangeOffice)
  exchangeOffice: ExchangeOffice;
}
