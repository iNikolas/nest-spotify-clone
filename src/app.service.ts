import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './common/providers/dev-config.service';

@Injectable()
export class AppService {
  constructor(
    private devConfigService: DevConfigService,
    @Inject('CONFIG') config: { port: string },
  ) {
    console.log(`Config port: ${config.port}`);
  }
}
