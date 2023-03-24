import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class GetEstimateDto {
  @IsString()
  @IsNotEmpty()
  inputCurrency: string;

  @IsString()
  @IsNotEmpty()
  outputCurrency: string;

  @IsNumber()
  @IsNotEmpty()
  inputAmount: number;
}
