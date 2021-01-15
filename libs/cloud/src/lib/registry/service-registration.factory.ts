import { Registration, ServiceRegistration } from '../interfaces';
import { Logger } from '@nestjs/common';

export class ServiceRegistrationFactory {
  private static INSTANCE: ServiceRegistrationFactory;

  private isRunning = false;

  private constructor(
    private registration: Registration,
    private serviceRegistration: ServiceRegistration<Registration>
  ) {}

  async register(): Promise<void> {
    if (this.isRunning) {
      return;
    }
    await this.serviceRegistration.register(this.registration);
    this.isRunning = true;
  }

  async deregister(): Promise<void> {
    await this.serviceRegistration.deregister(this.registration);
    this.isRunning = false;
  }

  /**
   *
   * @param registration
   * @param serviceRegistration
   * @returns ServiceRegistrationFactory
   */
  static getInstance(
    registration: Registration,
    serviceRegistration: ServiceRegistration<Registration>
  ): ServiceRegistrationFactory {
    if (registration == null)
      throw Error('an instance of Registration is required');
    if (serviceRegistration == null)
      throw Error('an instance of ServiceRegistration is required');

    if (this.INSTANCE == null) {
      Logger.log(
        `initializing ServiceRegistrationFactory factory.`,
        'ServiceRegistrationFactory'
      );
      this.INSTANCE = new ServiceRegistrationFactory(
        registration,
        serviceRegistration
      );
    }

    return this.INSTANCE;
  }
}
