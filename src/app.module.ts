import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./data/database/database.module";
import config from "./configuration/configuration";
import { ExchangeDataModule } from "./features/exchange-data/exchange-data.module";
import { ExchangersController } from "./api/controllers/exchangers.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
    ExchangeDataModule,
  ],
  controllers: [ExchangersController],
})
export class AppModule {}
