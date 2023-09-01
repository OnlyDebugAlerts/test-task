import { Entity, Property, PrimaryKey } from "@mikro-orm/core";

/*  Must be enum */
export type CountryCode = string;

@Entity()
export class Country {
  @PrimaryKey()
  code: CountryCode;

  @Property()
  name: string;
}
