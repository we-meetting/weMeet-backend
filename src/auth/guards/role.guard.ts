import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '@prisma/client';
import { Observable } from 'rxjs';

import { AllowedRoles } from '../decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<AllowedRoles[]>('roles', context.getHandler());

    if (!roles || roles.includes('ANY')) {
      // roles가 아니면 true를 리턴하고 진행한다.
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    return user && roles.includes(user.role);
  }
}
