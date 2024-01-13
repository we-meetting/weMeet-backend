import { SetMetadata } from '@nestjs/common';

import { UserRole } from '@prisma/client';

export type AllowedRoles = keyof typeof UserRole | 'ANY';
// keyof typeof를 쓰면 value만 가져올 수 있음

/**
 * @SetMetadata('role', Role.Owner)
 * key - 메타데이터가 저장되는 키를 정의하는 값
 * value - 키와 연결될 메타데이터 */
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
