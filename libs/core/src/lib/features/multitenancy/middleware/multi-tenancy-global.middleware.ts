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
 * File name:         multi-tenancy-global.middleware.ts
 * Last modified:     03/04/2021, 02:16
 ******************************************************************************/
import * as vhost from 'vhost';
import { MultiTenancyConfig } from '../multi-tenant.config';
import { IRequest } from '@ultimate-backend/common';
import { BuildTenantInfoHelper } from '../multi-tenancy-info.builder';


export function enableMultiTenancy(option: MultiTenancyConfig) {
  if (option.tenantResolver.resolverType === 'Domain') {
    return vhost('*.localhost', (req: IRequest, res, next) => {
      if (!option.enabled) {
        next();
      }

      if (req.vhost.length) {
        req.tenantInfo = new BuildTenantInfoHelper(req, option)
          .withOptions(true)
          .build();
        next();
      } else {
        next();
      }
    });
  }

  return (req: IRequest, res: Response, next) => {
    if (!option.enabled) {
      next();
    }

    req.tenantInfo = new BuildTenantInfoHelper(req, option)
      .withOptions(true)
      .build();
    next();
  };
}
