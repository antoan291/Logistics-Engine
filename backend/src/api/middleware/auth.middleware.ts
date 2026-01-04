import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../../core/auth/jwt.util";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

//middleware to verify JWT token
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    //Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    //extract token
    const token = authHeader.substring(7);

    //Verify token
    const payload = JwtUtil.verifyAccessToken(token);

    //atach user data to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    //continue to next middleware
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expiredtoken" });
  }
};

//middleware to check if user is owner
export const requireOwner = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (req.user.role !== "owner") {
    res.status(403).json({ error: "Owner access required" });
    return;
  }

  next();
};
