import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BooleanPayload } from '@ultimatebackend/contracts';

@Controller()
export class PlanService {

  @GrpcMethod('PlanService', 'PlanExist')
  async planExist(data: { params: string[] }): Promise<BooleanPayload> {
    return {
      success: true,
    };
  }

  @GrpcMethod('PlanService', 'FindOne')
  async findOne(data: { params: string[] }): Promise<BooleanPayload> {
    return {
      success: true,
    };
  }
}
