import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, isDBConnected } from '../database/db.js';
import { env } from '../config/env.js';

interface InMemoryUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'STUDENT' | 'RECRUITER' | 'ADMIN';
  college?: string | null;
  degree?: string | null;
  branch?: string | null;
  gradYear?: number | null;
  skills: string[];
  preferredRoles: string[];
  preferredLocations: string[];
}

export const memoryUsers = new Map<string, InMemoryUser>();

export function getMemoryUserById(id: string): InMemoryUser | undefined {
  for (const user of memoryUsers.values()) {
    if (user.id === id) return user;
  }
  return undefined;
}

// Pre-seed demo student user in memory
(async () => {
  const demoHash = await bcrypt.hash('DemoPass123!', 10);
  memoryUsers.set('demo@careerstream.dev', {
    id: 'usr-demo-001',
    email: 'demo@careerstream.dev',
    passwordHash: demoHash,
    name: 'Alex Rivera',
    role: 'STUDENT',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    preferredRoles: ['Software Engineer Intern', 'Frontend Developer'],
    preferredLocations: ['Bengaluru', 'Remote'],
  });
})();

export class AuthService {
  public static async signup(email: string, password: string, name: string) {
    if (!isDBConnected) {
      if (memoryUsers.has(email)) {
        throw new Error('An account with this email already exists.');
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user: InMemoryUser = {
        id: `usr-${Date.now()}`,
        email,
        passwordHash,
        name,
        role: 'STUDENT',
        skills: [],
        preferredRoles: [],
        preferredLocations: [],
      };
      memoryUsers.set(email, user);

      const token = this.generateToken(user.id, user.email, user.role);
      const refreshToken = this.generateRefreshToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          skills: user.skills,
          preferredRoles: user.preferredRoles,
          preferredLocations: user.preferredLocations,
        },
        token,
        refreshToken,
      };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        skills: user.skills,
        preferredRoles: user.preferredRoles,
        preferredLocations: user.preferredLocations,
      },
      token,
      refreshToken,
    };
  }

  public static async login(email: string, password: string) {
    if (!isDBConnected) {
      const user = memoryUsers.get(email);
      if (!user) {
        throw new Error('Invalid email or password.');
      }
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        throw new Error('Invalid email or password.');
      }
      const token = this.generateToken(user.id, user.email, user.role);
      const refreshToken = this.generateRefreshToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          college: user.college,
          degree: user.degree,
          branch: user.branch,
          gradYear: user.gradYear,
          skills: user.skills,
          preferredRoles: user.preferredRoles,
          preferredLocations: user.preferredLocations,
          role: user.role,
        },
        token,
        refreshToken,
      };
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const token = this.generateToken(user.id, user.email, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        college: user.college,
        degree: user.degree,
        branch: user.branch,
        gradYear: user.gradYear,
        skills: user.skills,
        preferredRoles: user.preferredRoles,
        preferredLocations: user.preferredLocations,
        role: user.role,
      },
      token,
      refreshToken,
    };
  }

  public static generateToken(userId: string, email: string, role: string): string {
    return jwt.sign({ userId, email, role }, env.JWT_SECRET, { expiresIn: '7d' });
  }

  public static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
  }

  public static verifyToken(token: string) {
    return jwt.verify(token, env.JWT_SECRET) as { userId: string; email: string; role: 'USER' | 'ADMIN' };
  }
}
