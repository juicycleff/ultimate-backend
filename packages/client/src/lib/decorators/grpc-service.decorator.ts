/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         service.decorator.ts
 * Last modified:     18/03/2021, 22:28
 ******************************************************************************/
import { applyDecorators } from '@nestjs/common';
import { ExtendMetadata } from '@ultimate-backend/common';
import { GRPC_CLIENT_SERVICE } from '../client.constants';
import { IGrpcServiceClient } from '../interface';

export function GrpcServiceClient(
  name: string,
  options: Omit<IGrpcServiceClient, 'transport'>
) {
  return applyDecorators((target, property) => {
    return ExtendMetadata(GRPC_CLIENT_SERVICE, {
      name,
      property,
      options: {
        ...options,
        transport: 'grpc',
        service: name,
      },
    })(target, property);
  });
}
