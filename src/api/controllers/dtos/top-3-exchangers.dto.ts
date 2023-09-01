export interface ISqlParams {
  country_code: string;
  exchange_office_name: string;
  office_profit: string;
  total_profit: string;
}

export class Top3ExchangersDto {
  countryCode: string;
  exchangeOfficeName: string;
  officeProfit: number;
  totalProfit: number;

  static from(sql: ISqlParams) {
    const dto = new Top3ExchangersDto();
    dto.countryCode = sql.country_code;
    dto.exchangeOfficeName = sql.exchange_office_name;
    dto.officeProfit = Number(sql.office_profit);
    dto.totalProfit = Number(sql.total_profit);

    return dto;
  }
}
