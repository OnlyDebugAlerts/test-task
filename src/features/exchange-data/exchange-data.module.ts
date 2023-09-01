import { Module } from "@nestjs/common";
import { ExchangeDataService } from "./exchange-data.service";

@Module({
  providers: [ExchangeDataService],
})
export class ExchangeDataModule {}
