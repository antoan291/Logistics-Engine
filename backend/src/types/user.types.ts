export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string | null;
}

export interface CreateUserInput {
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  created_by?: string | null;
}

export interface UpdateUserInput {
  full_name?: string;
  role?: string;
  is_active?: boolean;
}
