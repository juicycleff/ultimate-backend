import { Body, Controller, Post, Get } from '@nestjs/common';
import { BooleanPayload } from '@ultimatebackend/contracts';
import { NestCasbinService } from 'nestjs-casbin-mongodb';

@Controller('roles')
export class RolesController {
  constructor(private readonly casbinService: NestCasbinService) {}

  @Get('check-permission')
  async checkPermission(@Body() data: { params: string[] }): Promise<BooleanPayload> {
    const success = await this.casbinService.checkPermission(...data.params);
    return {
      success,
    };
  }

  @Post('add-policy')
  async addPolicy(@Body() data: { params: string[] }): Promise<BooleanPayload> {
    if (await this.casbinService.hasPolicy(...data.params) === false) {
      await this.casbinService.addPolicy(...data.params);
    }
    return {
      success: true,
    };
  }
}
