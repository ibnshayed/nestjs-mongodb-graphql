import { Types } from 'mongoose'
import type { UserRole } from '../../user/schema/user.schema'

/** Claims stored in access and refresh tokens. */
export interface JwtPayload {
  sub: string
  email: string
  role: UserRole
}

/** Set on `req.user` after JWT validation (no database lookup). */
export interface JwtAuthUser {
  _id: Types.ObjectId
  role: UserRole
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}
