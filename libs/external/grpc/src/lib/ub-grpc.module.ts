import { Module, Global } from '@nestjs/common';
import { UBGrpcService } from './ub-grpc.service';

@Global()
@Module({
  controllers: [],
  providers: [UBGrpcService],
  exports: [UBGrpcService],
})
export class UBGrpcModule {}
