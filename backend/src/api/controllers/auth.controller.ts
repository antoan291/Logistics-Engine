import { Response } from "express";
import { authService } from "../../core/auth/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class AuthController {
  // Register new user (owner only)
  // POST /api/auth/register
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, fullName, role } = req.body;

      // Validate required fields
      if (!email || !password || !fullName || !role) {
        res.status(400).json({
          error: "Missing required fields: email, password, fullName, role",
        });
        return;
      }

      // Get owner userId from authenticated request
      const createdBy = req.user!.userId;

      // Register user
      const result = await authService.register({
        email,
        password,
        full_name: fullName, // ← Fixed: was fullName, should be full_name
        role,
        createdBy,
      });

      res.status(201).json({
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      // ← Fixed: was 'err' in catch, but used 'error' in if
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  // Login user
  // POST /api/auth/login
  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        res.status(400).json({
          error: "Missing required fields: email, password",
        });
        return;
      }

      // Login user
      const result = await authService.login({ email, password });

      res.status(200).json({
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  // Refresh access token
  // POST /api/auth/refresh
  async refresh(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      // Validate refresh token is provided
      if (!refreshToken) {
        res.status(400).json({ error: "Refresh token is required" });
        return;
      }

      // Get new access token
      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        message: "Token refreshed successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  // Logout user (invalidate refresh token)
  // POST /api/auth/logout
  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      // Validate refresh token is provided
      if (!refreshToken) {
        res.status(400).json({ error: "Refresh token is required" });
        return;
      }

      // Delete refresh token from database
      await authService.logout(refreshToken);

      res.status(200).json({
        message: "Logout successful",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  // Logout from all devices
  // POST /api/auth/logout-all
  async logoutAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      // Delete all refresh tokens for this user
      await authService.logoutAll(req.user.userId);

      res.status(200).json({
        message: "Logged out from all devices",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}

export const authController = new AuthController();
