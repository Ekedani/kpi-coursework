export interface JwtPayload {
  id: string;
  apiKey?: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}
