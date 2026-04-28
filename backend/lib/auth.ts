import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = '7d';

export interface JwtPayload {
  sub: string; // userId
}

export function signJwt(userId: string): string {
  return jwt.sign({ sub: userId } satisfies JwtPayload, SECRET, {
    expiresIn: EXPIRES_IN,
  });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
