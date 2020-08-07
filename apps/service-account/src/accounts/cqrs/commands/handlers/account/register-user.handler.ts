import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  AuthServicesTypes,
  UserEntity,
  UserRepository,
} from '@ultimatebackend/repository';
import { generateVerificationCode } from '@ultimatebackend/common/utils/verification-code-generator';
import {
  CreateResponse,
  LoginServiceTypes,
} from '@ultimatebackend/proto-schema/account';
import { RegisterUserCommand } from '../../impl';
import { UserRegisteredEvent } from '@ultimatebackend/core/cqrs';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import {
  BillingsRpcClientService,
  RolesRpcClientService,
} from '@ultimatebackend/core';

/**
 * @implements {ICommandHandler<RegisterUserCommand>}
 * @classdesc CQRS command to register new user
 * @class
 */
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand> {
  logger = new Logger(this.constructor.name);

  /**
   * @constructor
   * @param userRepository
   * @param eventBus
   * @param jwtService
   * @param roleClient
   * @param billingClient
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly jwtService: JwtService,
    private readonly roleClient: RolesRpcClientService,
    private readonly billingClient: BillingsRpcClientService,
  ) {}

  /**
   * @description This method is called by the CQRS module
   * @param command
   * @return {CreateResponse} This response contains registration token
   */
  async execute(command: RegisterUserCommand): Promise<CreateResponse> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { cmd } = command;

    try {
      /** Check if user exist with email */
      const userExist: boolean = await this.userRepository.exist({
        'emails.address': cmd.email,
      });

      if (userExist) {
        throw new RpcException(
          'Email is not available, please try another email',
        );
      }

      let activationLink: string = null;
      let user: UserEntity = null;

      /** Here we handle social signup */
      if (cmd.service !== LoginServiceTypes.Password) {
        const services = new AuthServicesTypes();
        let authName: string = null;

        if (cmd.service === LoginServiceTypes.Facebook) {
          authName = 'facebook';
        } else if (cmd.service === LoginServiceTypes.Github) {
          authName = 'github';
        } else if (cmd.service === LoginServiceTypes.Google) {
          authName = 'google';
        } else {
          throw new RpcException('Missing registration typesss');
        }

        services[authName] = {
          email: cmd.email,
          accessToken: cmd.tokens.accessToken,
          userId: cmd.tokens.userId,
        };

        /** Initialize the user entity with required props */
        // @ts-ignore
        user = {
          firstname: cmd.firstname,
          lastname: cmd.lastname,
          emails: [
            {
              address: cmd.email,
              primary: true,
              verified: true,
              verificationCode: null,
            },
          ],
          services,
        };
      } else {
        /** Standard password registration */
        /** Generate verification pin code for our user */
        const pincode = generateVerificationCode(6, { type: 'string' });

        /** Initialize the user entity with required props */
        // @ts-ignore
        user = {
          firstname: cmd.firstname,
          lastname: cmd.lastname,
          emails: [
            {
              address: cmd.email,
              primary: true,
              verified: false,
              verificationCode: pincode,
            },
          ],
          services: {
            password: {
              hashed: cmd.password,
            },
          },
        };

        /** Encode user email and send it back as response to user.
         *  This token expires after 1h
         */
        const payload = { email: cmd.email, pincode };
        const jwtCode = this.jwtService.sign(payload, { expiresIn: '1h' });
        activationLink = `${jwtCode}`;
      }

      /** Persist initialized user entity to store */
      const result = await this.userRepository.create(user);

      const [, customer] = await Promise.all([
        this.roleClient.svc
          .addUserToRole({
            domain: '*',
            userId: result.id.toString(),
            actor: 'user',
            role: 'customer',
          })
          .toPromise(),
        this.billingClient.svc
          .createCustomer({
            currency: '',
            number: '',
            name: `${result.firstname} ${result.lastname}`,
            email: result.emails.reduce(
              (previousValue) =>
                previousValue.primary === true && previousValue,
            ).address,
          })
          .toPromise(),
      ]);

      const newUser: UserEntity & {
        activationLink?: string;
        service?: 'social' | 'local';
      } = await this.userRepository.findOneByIdAndUpdate(result.id.toString(), {
        updates: {
          $set: { 'settings.stripeId': customer.customer.id },
        },
      });
      /** Attach the activation link for the event. This is important for the
       * notification service to properly send activation e-mail.
       */
      newUser.activationLink = activationLink;
      newUser.service = activationLink ? 'local' : 'social';

      /** Publish user created event */
      this.eventBus.publish(new UserRegisteredEvent(newUser));

      return { activationLink };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
