import { IsNotEmpty, IsString } from 'class-validator';

export class GetRatesDto {
  @IsString()
  @IsNotEmpty()
  baseCurrency: string;

  @IsString()
  @IsNotEmpty()
  quoteCurrency: string;
}
