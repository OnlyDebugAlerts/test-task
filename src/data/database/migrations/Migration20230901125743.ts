import { Migration } from "@mikro-orm/migrations";

export class Migration20230901125743 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "country" ("code" varchar(255) not null, "name" varchar(255) not null, constraint "country_pkey" primary key ("code"));',
    );

    this.addSql(
      'create table "exchange_office" ("id" serial primary key, "name" varchar(255) not null, "country_code" varchar(255) not null);',
    );

    this.addSql(
      'create table "exchange" ("id" serial primary key, "from" varchar(255) not null, "to" varchar(255) not null, "ask" int not null, "date" timestamptz not null default now(), "exchange_office_id" int not null);',
    );

    this.addSql(
      'create table "rate" ("id" serial primary key, "from" varchar(255) not null, "to" varchar(255) not null, "in" int not null, "out" int not null, "reserve" int not null, "date" timestamptz not null default now(), "exchange_office_id" int not null);',
    );

    this.addSql(
      'alter table "exchange_office" add constraint "exchange_office_country_code_foreign" foreign key ("country_code") references "country" ("code") on update cascade;',
    );

    this.addSql(
      'alter table "exchange" add constraint "exchange_exchange_office_id_foreign" foreign key ("exchange_office_id") references "exchange_office" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "rate" add constraint "rate_exchange_office_id_foreign" foreign key ("exchange_office_id") references "exchange_office" ("id") on update cascade;',
    );
    this.addSql(`
    INSERT INTO "public"."country" ("code", "name") VALUES
('UKR', 'Ukraine'),
('SVK', 'Slovakia');

-- Добавление обменных пунктов
INSERT INTO "public"."exchange_office" ("name", "country_code") VALUES
('Exchanger 1', 'UKR'),
('Exchanger 2', 'UKR'),
('Exchanger 3', 'SVK');

-- Получение ID последних добавленных обменных пунктов
DO $$ 
DECLARE 
    exchanger1_id int;
    exchanger2_id int;
    exchanger3_id int;
BEGIN 
    SELECT id INTO exchanger1_id FROM "public"."exchange_office" WHERE name = 'Exchanger 1';
    SELECT id INTO exchanger2_id FROM "public"."exchange_office" WHERE name = 'Exchanger 2';
    SELECT id INTO exchanger3_id FROM "public"."exchange_office" WHERE name = 'Exchanger 3';

    -- Добавление обменных курсов
    INSERT INTO "public"."exchange" ("from", "to", "ask", "date", "exchange_office_id") VALUES
    ('EUR', 'USD', 110, '2023-04-24T22:55:33.000Z', exchanger1_id),
    ('USD', 'UAH', 400, '2023-04-24T22:55:33.000Z', exchanger1_id),
    ('AUD', 'CAD', 90, '2023-04-25T10:15:33.000Z', exchanger2_id),
    ('USD', 'AUD', 70, '2023-04-25T11:20:45.000Z', exchanger2_id),
    ('EUR', 'GBP', 95, '2023-04-25T14:55:33.000Z', exchanger3_id),
    ('GBP', 'USD', 100, '2023-04-25T15:55:33.000Z', exchanger3_id);

    -- Добавление курсов валют
    INSERT INTO "public"."rate" ("from", "to", "in", "out", "reserve", "date", "exchange_office_id") VALUES
    ('EUR', 'USD', 1, 1.1, 120000, '2023-04-24T22:55:33.000Z', exchanger1_id),
    ('USD', 'UAH', 1, 40, 150000, '2023-04-24T22:55:33.000Z', exchanger1_id),
    ('AUD', 'CAD', 1, 1.2, 130000, '2023-04-25T10:15:33.000Z', exchanger2_id),
    ('USD', 'AUD', 1, 0.9, 110000, '2023-04-25T11:20:45.000Z', exchanger2_id),
    ('EUR', 'GBP', 1, 0.85, 100000, '2023-04-25T14:55:33.000Z', exchanger3_id),
    ('GBP', 'USD', 1, 1.05, 120000, '2023-04-25T15:55:33.000Z', exchanger3_id);

END $$;
`);
  }

  async down(): Promise<void> {
    this.addSql('alter table "exchange_office" drop constraint "exchange_office_country_code_foreign";');

    this.addSql('alter table "exchange" drop constraint "exchange_exchange_office_id_foreign";');

    this.addSql('alter table "rate" drop constraint "rate_exchange_office_id_foreign";');

    this.addSql('drop table if exists "country" cascade;');

    this.addSql('drop table if exists "exchange_office" cascade;');

    this.addSql('drop table if exists "exchange" cascade;');

    this.addSql('drop table if exists "rate" cascade;');
  }
}
