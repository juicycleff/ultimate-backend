import { PlanEntity } from '@graphqlcqrs/repository';

export const planSeedData: PlanEntity[] = [
   // @ts-ignore
  {
    name: 'Basic',
    normalizedName: 'basic',
    active: true,
    free: true,
    currentPrice: {
      currency: 'usd',
      price: 0,
    },
    features: [
      {
        active: true,
        description: 'You can add 10 projects to your tenant for free',
        full: false,
        name: 'Project',
        min: 0,
        max: 10,
      },
    ],
  },
  // @ts-ignore
  {
    name: 'Bronze Plan',
    normalizedName: 'bronze',
    active: true,
    free: false,
    currentPrice: {
      currency: 'usd',
      price: 1000,
    },
    features: [
      {
        active: true,
        description: 'You can add 100 projects to your tenant for small price',
        full: false,
        name: 'Project',
        min: 0,
        max: 100,
      },
    ],
  },
  // @ts-ignore
  {
    name: 'Silver',
    normalizedName: 'silver',
    active: true,
    free: false,
    currentPrice: {
      currency: 'usd',
      price: 6000,
    },
    features: [
      {
        active: true,
        description: 'You can add 1000 projects to your tenant',
        full: false,
        name: 'Project',
        min: 0,
        max: 1000,
      },
    ],
  },
  // @ts-ignore
  {
    name: 'Gold',
    normalizedName: 'gold',
    active: true,
    free: false,
    currentPrice: {
      currency: 'usd',
      price: 10000,
    },
    features: [
      {
        active: true,
        description: 'You can add 5000 projects to your tenant',
        full: false,
        name: 'Project',
        min: 0,
        max: 5000,
      },
    ],
  },
  // @ts-ignore
  {
    name: 'Platinum',
    normalizedName: 'platinum',
    active: true,
    free: false,
    currentPrice: {
      currency: 'usd',
      price: 50000,
    },
    features: [
      {
        active: true,
        description: 'You can add unlimited projects to your tenant',
        full: true,
        name: 'Project',
      },
    ],
  },
];
