import jwt from "jsonwebtoken";
import { config } from "../../config/config";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtUtil {
  //generate access token
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
  }
  //generate refresh token
  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
  }

  //verify access token
  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtPayload;
  }
  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;
  }
}
