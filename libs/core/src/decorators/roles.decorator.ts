import { SetMetadata } from '@nestjs/common';

export const RolesMetaKey = 'roles';

export const Roles = (...roles: string[]) => SetMetadata(RolesMetaKey, roles);
