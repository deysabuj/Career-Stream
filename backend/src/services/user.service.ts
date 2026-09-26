import { prisma, isDBConnected } from '../database/db.js';
import { getMemoryUserById } from './auth.service.js';

export class UserService {
  public static async getProfile(userId: string) {
    if (!isDBConnected) {
      const user = getMemoryUserById(userId);
      if (!user) {
        throw new Error('User not found.');
      }
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        college: user.college || null,
        degree: user.degree || null,
        branch: user.branch || null,
        gradYear: user.gradYear || null,
        skills: user.skills || [],
        preferredRoles: user.preferredRoles || [],
        preferredLocations: user.preferredLocations || [],
        resumeUrl: null,
        role: user.role,
        createdAt: new Date().toISOString(),
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        college: true,
        degree: true,
        branch: true,
        gradYear: true,
        skills: true,
        preferredRoles: true,
        preferredLocations: true,
        resumeUrl: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  public static async updateProfile(userId: string, data: Partial<{
    name: string;
    college: string;
    degree: string;
    branch: string;
    gradYear: number;
    skills: string[];
    preferredRoles: string[];
    preferredLocations: string[];
    resumeUrl: string;
  }>) {
    if (!isDBConnected) {
      const user = getMemoryUserById(userId);
      if (!user) {
        throw new Error('User not found.');
      }
      if (data.name) user.name = data.name;
      if (data.college) user.college = data.college;
      if (data.degree) user.degree = data.degree;
      if (data.branch) user.branch = data.branch;
      if (data.gradYear) user.gradYear = data.gradYear;
      if (data.skills) user.skills = data.skills;
      if (data.preferredRoles) user.preferredRoles = data.preferredRoles;
      if (data.preferredLocations) user.preferredLocations = data.preferredLocations;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        college: user.college || null,
        degree: user.degree || null,
        branch: user.branch || null,
        gradYear: user.gradYear || null,
        skills: user.skills || [],
        preferredRoles: user.preferredRoles || [],
        preferredLocations: user.preferredLocations || [],
        resumeUrl: null,
        role: user.role,
      };
    }
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        college: true,
        degree: true,
        branch: true,
        gradYear: true,
        skills: true,
        preferredRoles: true,
        preferredLocations: true,
        resumeUrl: true,
        role: true,
      },
    });
  }
}
