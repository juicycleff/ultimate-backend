import * as GRPCClient from 'node-grpc-client';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const PROTO_PATH = './proto/user.proto';

export const userGrpcClient = new GRPCClient(PROTO_PATH, 'user', 'UserService', 'http://127.0.0.1:9000');

export const grpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        package: 'user',
        protoPath: join(__dirname, './proto/user.proto'),
        url: 'http://localhost:9000',
    },
};
