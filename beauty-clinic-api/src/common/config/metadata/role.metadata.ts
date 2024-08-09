import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from "@feature/security/data/role.enum";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);