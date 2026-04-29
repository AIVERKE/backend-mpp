import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface User {
  id: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    await Promise.resolve(); // Solo para que el linter no llore por el async
    if (username === 'admin' && pass === 'password') {
      return { id: 1, username: 'admin' };
    }
    return null;
  }

  login(user: User): { access_token: string } {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
