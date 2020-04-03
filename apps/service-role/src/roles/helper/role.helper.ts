import { IResourceBuilder } from '../interface';

export function defaultResourceBuilder(): IResourceBuilder[] {
  return [
    {
      name: 'user',
      domain: '*',
      actions: {
        read: ['customer'],
        update: ['customer'],
        delete: ['customer'],
        create: ['customer'],
      },
    },
    {
      name: 'tenant',
      domain: '*',
      actions: {
        read: ['customer'],
        update: [],
        delete: [],
        create: ['customer'],
      },
    },
    {
      name: 'billing:card',
      domain: '*',
      actions: {
        read: ['customer'],
        update: ['customer'],
        delete: ['customer'],
        create: ['customer'],
      },
    },
    {
      name: 'billing:subscription',
      domain: '*',
      actions: {
        read: ['customer'],
        update: ['customer'],
        delete: ['customer'],
        create: ['customer'],
      },
    },
    {
      name: 'billing:invoice',
      domain: '*',
      actions: {
        read: ['customer'],
        update: ['customer'],
        delete: ['customer'],
        create: ['customer'],
      },
    },
  ];
}
