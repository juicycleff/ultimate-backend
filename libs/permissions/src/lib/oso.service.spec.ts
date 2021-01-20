import { Test } from '@nestjs/testing';
import { OsoService } from './oso.service';
import { PERMISSION_MODULE_OPTIONS } from './permissions.constants';
import { PermissionsModuleOptions } from './interfaces';

describe('PermissionsService', () => {
  let service: OsoService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OsoService,
        {
          provide: PERMISSION_MODULE_OPTIONS,
          useValue: {
            oso: {},
            debug: true,
          } as PermissionsModuleOptions,
        },
      ],
    }).compile();

    service = module.get<OsoService>(OsoService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
