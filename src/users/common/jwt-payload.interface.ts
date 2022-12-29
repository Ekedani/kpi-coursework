import { UserRole } from './user-role.enum';

export interface JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}
