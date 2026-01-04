import { userRepository } from "../../infra/repositories/user.repository";
import { refreshTokenRepository } from "../../infra/repositories/refresh-token.repository";
import { PasswordUtil } from "./password.util";
import { JwtUtil, JwtPayload } from "./jwt.util";
import { User } from "../../types/user.types";

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  role: string;
  createdBy: string; //Owner user id
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponce {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  //Register new user
  async register(input: RegisterInput): Promise<AuthResponce> {
    //Validate email format
    if (!this.isValidEmail(input.email)) {
      throw new Error("Invalid email format");
    }

    //check if email already exists
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    //validate password strength
    const passwordValidation = PasswordUtil.validateStrength(input.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(", "));
    }

    //hash password
    const passwordHash = await PasswordUtil.hash(input.password);

    //create user in database
    const user = await userRepository.create({
      email: input.email,
      password_hash: passwordHash,
      full_name: input.full_name,
      role: input.role,
      created_by: input.createdBy,
    });

    //generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  //Login user
  async login(input: LoginInput): Promise<AuthResponce> {
    //find user by email
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    //check if user is active
    if (!user.is_active) {
      throw new Error("User account is deactivated");
    }

    //verify password
    const isPasswordValid = await PasswordUtil.verify(
      input.password,
      user.password_hash
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    //Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  //Refresh access token using refresh token
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
  }> {
    //1. verify refresh token is valid
    let payload: JwtPayload;
    try {
      payload = JwtUtil.verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new Error("Invalid or expired refresh token");
    }

    //2.check if refresh token exists in database
    const storedToken = await refreshTokenRepository.findByToken(refreshToken);
    if (!storedToken) {
      throw new Error("Refresh token not found");
    }

    //3. check if token is expired
    if (new Date(storedToken.expires_at) < new Date()) {
      await refreshTokenRepository.deleteByToken(refreshToken);
      throw new Error("Refresh token expired");
    }

    //4. get user details
    const user = await userRepository.findById(payload.userId);
    if (!user || !user.is_active) {
      throw new Error("User not found or deactivated");
    }

    //5. generate new access token
    const newAccessToken = JwtUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken: newAccessToken };
  }

  //logout user
  async logout(userId: string): Promise<void> {
    await refreshTokenRepository.deleteByToken(userId);
  }

  //logout from all devices
  async logoutAll(userId: string): Promise<void> {
    await refreshTokenRepository.deleteAllByUserId(userId);
  }

  //generate access and refresh tokens
  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    //save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); //7 days expiry

    await refreshTokenRepository.create(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  //validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const authService = new AuthService();
