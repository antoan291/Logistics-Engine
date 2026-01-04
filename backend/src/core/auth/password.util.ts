import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export class PasswordUtil {
  static async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
  }

  static async verify(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static validateStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one digit.");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
