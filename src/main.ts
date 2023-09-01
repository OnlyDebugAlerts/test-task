import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExchangeDataService } from "./features/exchange-data/exchange-data.service";
import { ExchangeOfficeFileParser } from "./utils/exchange-office-parser/exchange-office-file-parser";
import { INestApplication } from "@nestjs/common";

async function parseDumpAndImportToDb(app: INestApplication) {
  const fileParser = new ExchangeOfficeFileParser("file.yml");
  const parsedData = await fileParser.parse();

  const exchangeDataService = app.get(ExchangeDataService);
  await exchangeDataService.importParsedDataToDB(parsedData);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // await parseDumpAndImportToDb(app);

  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
