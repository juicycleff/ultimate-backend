import { Test } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PERMISSION_MODULE_OPTIONS } from './permissions.constants';
import { PermissionsModuleOptions } from './interfaces';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PERMISSION_MODULE_OPTIONS,
          useValue: {
            oso: {},
          } as PermissionsModuleOptions,
        },
      ],
    }).compile();

    service = module.get(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
