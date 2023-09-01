import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Country } from "../models/country";
import { ExchangeOffice } from "../models/exchange-office";
import { Exchange } from "../models/exchange";
import { Rate } from "../models/rate";
import { LoadStrategy } from "@mikro-orm/core";
import { join } from "path";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
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
      }),
    }),
  ],
})
export class DatabaseModule {}
