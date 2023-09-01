import { Controller, Get } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/core";
import { ISqlParams, Top3ExchangersDto } from "./dtos/top-3-exchangers.dto";

@Controller()
export class ExchangersController {
  constructor(private readonly _em: EntityManager) {}

  @Get("top-exchangers")
  async getTopExchangers() {
    const em = this._em.fork();
    /* TODO: Just for test task, for better security use sql functions or params query */
    const sql = this.getTopExchangersSql();
    const results: ISqlParams[] = await em.getConnection().execute(sql);

    return results.map(sql => Top3ExchangersDto.from(sql));
  }

  private getTopExchangersSql(): string {
    return `
        WITH CountryProfit AS (
        SELECT
            eo.country_code,
            SUM((e.ask * r."in") - r."out") AS country_profit
        FROM
            public.exchange e
            JOIN public.rate r ON e.exchange_office_id = r.exchange_office_id
            AND e."from" = r."from"
            AND e."to" = r."to"
            JOIN public.exchange_office eo ON e.exchange_office_id = eo.id
        GROUP BY
            eo.country_code
        ORDER BY
            country_profit DESC
        LIMIT
            3
    ), OfficeProfit AS (
        SELECT
            eo.country_code,
            eo.name AS exchange_office_name,
            SUM((e.ask * r."in") - r."out") AS office_profit,
            ROW_NUMBER() OVER(
                PARTITION BY eo.country_code
                ORDER BY
                    SUM((e.ask * r."in") - r."out") DESC
            ) as rn
        FROM
            public.exchange e
            JOIN public.rate r ON e.exchange_office_id = r.exchange_office_id
            AND e."from" = r."from"
            AND e."to" = r."to"
            JOIN public.exchange_office eo ON e.exchange_office_id = eo.id
        GROUP BY
            eo.country_code,
            eo.name
    )
    SELECT
        cp.country_code,
        op.exchange_office_name,
        op.office_profit,
        cp.country_profit AS total_profit
    FROM
        CountryProfit cp
        JOIN OfficeProfit op ON cp.country_code = op.country_code
    WHERE
        op.rn <= 3
    ORDER BY
        cp.country_profit DESC,
        op.office_profit DESC;
    `;
  }
}
