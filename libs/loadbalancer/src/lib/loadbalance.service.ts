import { Injectable } from '@nestjs/common';
import { BaseStrategy, ILoadbalance, IService } from '@ultimate-backend/common';

@Injectable()
export class LoadbalanceService implements ILoadbalance {

  pick(serviceName: string): IService {
    return undefined;
  }

  pickLoadBalancer(serviceName: string): BaseStrategy {
    return undefined;
  }

}
