import { EncryptJWT, base64url, JWTPayload, jwtDecrypt } from 'jose';
import bcrypt from 'bcrypt';
import { Session, Role, User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const DECODED_JWT_SECRET = base64url.decode(JWT_SECRET);

const JWT_ISSUER = 'ani-journey';
const JWT_AUDIENCE = 'ani-journey';

export interface AccessTokenPayload extends JWTPayload {
  userId: User['id'];
  role: Role;
  sessionId: Session['id'];
}

export interface RefreshTokenPayload extends JWTPayload {
  userId: User['id'];
  sessionId: Session['id'];
}

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
  return isPasswordValid;
}

export async function createJWT<TokenPayload extends JWTPayload>(
  payload: TokenPayload,
  expiresIn: string,
): Promise<string> {
  const jwt = await new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(`${expiresIn}m`)
    .encrypt(DECODED_JWT_SECRET);

  return jwt;
}

export async function verifyJWT<TokenPayload extends JWTPayload>(token: string): Promise<TokenPayload> {
  const { payload } = await jwtDecrypt(token, DECODED_JWT_SECRET, { issuer: JWT_ISSUER, audience: JWT_AUDIENCE });
  return payload as TokenPayload;
}
