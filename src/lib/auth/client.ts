'use client';

import type { User } from '@/types/user';
import { envConfig } from '../../../env';

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
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
  token: string;
  avatar: string;
  name: string;
  email: string;
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
      localStorage.setItem('avatar', data.avatar);
      localStorage.setItem('name', data.name);
      localStorage.setItem('email', data.email);


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

    return { data: user };
  }

  async signOut(): Promise<AuthResponse<void>> {
    localStorage.removeItem('auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
