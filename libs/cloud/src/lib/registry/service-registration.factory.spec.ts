import { ServiceRegistrationFactory } from './service-registration.factory';
import { Registration, ServiceRegistration } from '@ultimate-backend/cloud';
import { createMock } from 'ts-auto-mock';

describe('ServiceRegistrationFactory', () => {
  let serviceRegistration: ServiceRegistration<Registration>;
  let registration: Registration;

  beforeEach(() => {
    serviceRegistration = createMock<ServiceRegistration<Registration>>();
    registration = createMock<Registration>();
  });

  it('throw if registration is null', async () => {
    const t = () => ServiceRegistrationFactory.getInstance(null, null);
    expect(t).toThrowError('an instance of Registration is required');
  });

  it('throw if service registration is null', async () => {
    const t = () => ServiceRegistrationFactory.getInstance(registration, null);
    expect(t).toThrowError('an instance of ServiceRegistration is required');
  });

  it('register and deregister service works', async () => {
    const sr = ServiceRegistrationFactory.getInstance(registration, serviceRegistration);
    expect(await sr.register()).toBeUndefined();
    expect(await sr.register()).toBeUndefined();
    expect(await sr.deregister()).toBeUndefined();
  });

  it('getInstance initializes a singleton class', async () => {
    const t = ServiceRegistrationFactory.getInstance(registration, serviceRegistration);
    expect(t).toBeDefined();
  });
});
