import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';

@Injectable()
export class TasksService {
  constructor(private httpService: HttpService) {}
  private readonly logger = new Logger(TasksService.name);

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // handleCron() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  @Cron('*/12 * * * * *')
  async handleCron() {
    this.logger.debug('Called every 12 seconds');
    console.log('Calling internal Hello World API every 12 seconds...');

    try {
      const response: AxiosResponse<string> = await this.httpService
        .get('http://localhost:5000/hello-world')
        .toPromise();

      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error calling internal Hello World API:', error.message);
    }
  }
}
