import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const APPLE_ISSUER = 'https://appleid.apple.com';
const jwks = createRemoteJWKSet(new URL(`${APPLE_ISSUER}/auth/keys`));

export async function verifyAppleIdentityToken(identityToken: string) {
  const audience = process.env.APPLE_CLIENT_ID;
  if (!audience) {
    throw new InternalServerErrorException(
      'Apple sign-in is not configured on the server (APPLE_CLIENT_ID missing).',
    );
  }

  try {
    const { payload } = await jwtVerify(identityToken, jwks, {
      issuer: APPLE_ISSUER,
      audience,
    });
    return payload as { sub: string; email?: string };
  } catch {
    throw new UnauthorizedException('Invalid Apple identity token');
  }
}
