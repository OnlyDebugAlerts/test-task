import { NestFactory } from "@nestjs/core";
import { Country } from "../models/country";
import { ExchangeOffice } from "../models/exchange-office";
import { Exchange } from "../models/exchange";
import { Rate } from "../models/rate";
import { LoadStrategy } from "@mikro-orm/core";
import { join } from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import config from "../../configuration/configuration";

module.exports = new Promise(async resolve => {
  const configCtx = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  );
  const configService = configCtx.get(ConfigService);

  resolve({
    entities: [Country, ExchangeOffice, Exchange, Rate],
    dbName: "test-task",
    type: "postgresql",
    password: configService.get<string>("database.password"),
    user: configService.get<string>("database.user"),
    host: configService.get<string>("database.host"),
    port: 5449,
    loadStrategy: LoadStrategy.JOINED,
    migrations: {
      tableName: "migrations",
      path: join(__dirname, "migrations"),
      transactional: true,
      allOrNothing: true,
      safe: false,
      emit: "ts",
    },
  });
});
