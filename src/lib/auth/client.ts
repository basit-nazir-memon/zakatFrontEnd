'use client';

import type { User } from '@/types/user';
import { envConfig } from '../../../env';

let user = {
  id: '',
  avatar: '',
  firstName: '',
  lastName: '',
  email: '',
  role: 'Viewer'
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

interface ErrorResponse {
  msg: string;
}

interface SignInResponse {
  id: string;
  token: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthResponse<T> {
  error?: string;
  data?: T;
}

class AuthClient {
  async signInWithOAuth(_: SignInWithOAuthParams): Promise<AuthResponse<void>> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<AuthResponse<void>> {
    const { email, password } = params;

    try {
      const response: Response = await fetch(`${envConfig.url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json() as ErrorResponse;
        return { error: errorData.msg || 'Invalid credentials' };
      }

      const data: SignInResponse = await response.json() as SignInResponse;

      localStorage.setItem('auth-token', data.token);

      user.id = data.id;
      user.avatar = data.avatar;
      user.email = data.email;
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.role = data.role;

      return {};
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'Server error. Please try again later.' };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<AuthResponse<void>> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<AuthResponse<void>> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<AuthResponse<User | null>> {
    const token: string | null = localStorage.getItem('auth-token');

    if (!token) {
      return { data: null };
    }

    if (token && user.id == ''){
      try {
        const response: Response = await fetch(`${envConfig.url}/user/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
  
        if (!response.ok) {
          return { data: null };
        }
  
        const data: SignInResponse = await response.json() as SignInResponse;

        user.id = data.id;
        user.avatar = data.avatar;
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.role = data.role;
        
        return { data: user };

      } catch (error) {
        if (error instanceof Error) {
          return { data: null };
        }
        return { data: null };
      }
    }

    return { data: user };
  }

  getUserSimple() {
    return { data: user };
  }

  isAdmin() {
    return user.role == "Admin";
  }

  isAdminOREditor() {
    return (user.role == "Admin" || user.role == "Editor");
  }

  setAvatar(avatar : string){
    user.avatar = avatar;
  }

  async signOut(): Promise<AuthResponse<void>> {
    localStorage.removeItem('auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
