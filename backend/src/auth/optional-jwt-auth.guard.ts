import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Decodes the JWT when present but never rejects the request — used for endpoints (like the
 * social feed) that work for anonymous visitors but personalize the response when logged in. */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(_err: unknown, user: TUser): TUser {
    return user;
  }
}
