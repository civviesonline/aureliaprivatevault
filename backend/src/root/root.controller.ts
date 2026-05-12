import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

type RootResponse = {
  name: string;
  status: 'online';
  message: string;
};

@ApiTags('Root')
@Controller()
export class RootController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns basic application metadata.',
  })
  getRoot(): RootResponse {
    return {
      name: this.config.getOrThrow<string>('app.appName'),
      status: 'online',
      message: 'Velmont Private Bank API is ready.',
    };
  }
}
