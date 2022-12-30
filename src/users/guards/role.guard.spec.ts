import { RoleGuard } from './role.guard';
import { Reflector } from '@nestjs/core';

describe('RoleGuard', () => {
  let roleGuard: RoleGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = new Reflector();
    roleGuard = new RoleGuard(reflector);
  });

  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });
});
