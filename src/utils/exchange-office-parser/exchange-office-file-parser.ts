import { IExchangeOfficeParser, IExchangeOfficeParserResult } from "./exchange-office-parser.interface";
import * as fs from "fs/promises";
import * as yaml from "js-yaml";

export class ExchangeOfficeFileParser implements IExchangeOfficeParser {
  constructor(private readonly filename: string) {}

  async parse(): Promise<IExchangeOfficeParserResult> {
    const data = await fs.readFile(this.filename, "utf8");
    const yamlDump = await this.convertDumpToYaml(data);
    const jsonDump = yaml.load(yamlDump) as Record<string, any>;

    return {
      countries: jsonDump.countries.map(country => ({
        code: country.code,
        name: country.name,
      })),
      exchangeOffices: jsonDump["exchange-offices"].map(exchangeOffice => ({
        id: exchangeOffice.id,
        name: exchangeOffice.name,
        country: exchangeOffice.country,
        rates: exchangeOffice.rates.map(rate => ({
          from: rate.from,
          to: rate.to,
          in: rate.in,
          out: rate.out,
          reserve: rate.reserve,
          date: rate.date,
        })),
        exchanges:
          exchangeOffice.exchanges?.map(exchange => ({
            from: exchange.from,
            to: exchange.to,
            ask: exchange.ask,
            date: exchange.date,
          })) || [],
      })),
    };
  }

  private getFormattedLine(line: string): string {
    if (line.includes("=")) {
      return line;
    }

    const lastWord = line.split(" ").pop();

    return `${line.replace(lastWord, `- ${lastWord}`).split("\r")[0]}:\r`;
  }

  private async convertDumpToYaml(data: string): Promise<string> {
    const lines = data.split("\n").filter(Boolean);

    return lines
      .map((line, i) => {
        if (!line.includes("=")) {
          const nextElementIndex = i + 1;
          if (this.getFormattedLine(lines[nextElementIndex] || "").includes("- ")) {
            return `${line.split("\r")[0]}:\r`;
          }

          return this.getFormattedLine(line);
        }

        return line.replace(" =", ":");
      })
      .join("\n");
  }
}
