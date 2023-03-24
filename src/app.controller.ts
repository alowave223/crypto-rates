import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GetEstimateDto } from './dto/getEstimate.dto';
import { GetRatesDto } from './dto/getRates.dto';
import { GetEstimateResponse } from './interfaces/getEstimateResponse.interface';
import { GetRatesResponse } from './interfaces/getRatesResponse.inteface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/estimate')
  async estimate(
    @Body() getEstimateDto: GetEstimateDto,
  ): Promise<GetEstimateResponse> {
    return await this.appService.getEstimate(getEstimateDto);
  }

  @Post('/rates')
  async rates(@Body() getRatesDto: GetRatesDto): Promise<GetRatesResponse[]> {
    return this.appService.getRates(getRatesDto);
  }
}
