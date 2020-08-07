import { Plan } from '@ultimatebackend/proto-schema/billing';

export class PlanSeed {
  plans: Plan[];

  constructor() {
    this.init();
  }

  private init() {
    this.plans = [
      this.getPlan({
        name: 'Basic',
        normalizedName: 'basic',
        free: true,
        maxSpeed: 1,
        amount: 0,
        maxPoint: 5,
      }),
      this.getPlan({
        name: 'Starter',
        normalizedName: 'starter',
        free: false,
        maxSpeed: 3,
        amount: 2500,
        maxPoint: 10,
      }),
      this.getPlan({
        name: 'Medium',
        normalizedName: 'medium',
        free: false,
        maxSpeed: 5,
        amount: 7500,
        maxPoint: 50,
      }),
      this.getPlan({
        name: 'Large',
        normalizedName: 'large',
        free: false,
        maxSpeed: 10,
        amount: 12000,
        maxPoint: 100,
      }),
    ];
  }

  private getPlan({
    name,
    normalizedName,
    free,
    amount,
    maxSpeed,
    maxPoint,
  }: {
    name: string;
    normalizedName: string;
    free: boolean;
    amount: number;
    maxSpeed: number;
    maxPoint: number;
  }): Plan {
    // @ts-ignore
    return {
      name,
      normalizedName,
      free,
      stripeId: null,
      active: true,
      price: {
        amount,
        currency: 'usd',
        id: null,
        name: null,
        trialDays: null,
      },
      features: [
        {
          active: true,
          description: 'Connections',
          min: 0,
          max: maxPoint,
          unit: 'point',
          full: false,
          name: 'Connection',
          normalizedName: 'connection',
        },
        {
          active: true,
          description: 'Bandwidth',
          min: 0,
          max: maxSpeed,
          unit: 'Mbps',
          full: false,
          name: 'Bandwidth',
          normalizedName: 'bandwidth',
        },
      ],
    };
  }

  public get getSeedData(): Plan[] {
    return this.plans;
  }
}
