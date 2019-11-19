import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { SendGridModule } from '@anchan828/nest-sendgrid';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SendGridModule.forRoot({
          apikey: 'SENDGRID-API-KEY',
        }),
      ],
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
