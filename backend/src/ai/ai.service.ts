export interface JobSummaryResult {
  overview: string;
  keyResponsibilities: string[];
  keyRequirements: string[];
  recommendedSkills: string[];
}

export interface ResumeMatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  fitLevel: 'Strong Fit' | 'Moderate Fit' | 'Growth Opportunity';
}

export class AIService {
  /**
   * Generates a structured quick summary of a job description
   */
  public static async summarizeJob(title: string, description: string, skills: string[]): Promise<JobSummaryResult> {
    // High performance heuristic engine ensuring fast load times & structured fallback
    const sentences = description
      .split(/\. |\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15);

    const overview = sentences.slice(0, 2).join('. ') + (sentences.length > 0 ? '.' : '');
    
    const keyResponsibilities = sentences
      .filter((s) => /build|develop|work|design|collaborate|implement|write/i.test(s))
      .slice(0, 4);

    const keyRequirements = sentences
      .filter((s) => /degree|experience|knowledge|proficient|strong|familiar|understanding|skills/i.test(s))
      .slice(0, 4);

    return {
      overview: overview || `Opportunity for ${title} to contribute to high-impact projects at scale.`,
      keyResponsibilities: keyResponsibilities.length > 0 ? keyResponsibilities : [
        `Collaborate with cross-functional teams to build scalable software solutions.`,
        `Write clean, testable, and maintainable code adhering to best practices.`,
        `Participate in code reviews and active technical design sessions.`
      ],
      keyRequirements: keyRequirements.length > 0 ? keyRequirements : [
        `Currently pursuing or recently completed Bachelor's/Master's in CS, IT, or related fields.`,
        `Solid understanding of core Data Structures, Algorithms, and Object-Oriented Design.`,
        `Strong problem-solving skills and eagerness to learn new tech stacks.`
      ],
      recommendedSkills: skills,
    };
  }

  /**
   * Evaluates user profile / resume skills against job requirements
   */
  public static calculateResumeMatch(userSkills: string[], jobSkills: string[], userDegree?: string): ResumeMatchResult {
    if (!jobSkills || jobSkills.length === 0) {
      return {
        matchPercentage: 85,
        matchedSkills: userSkills.slice(0, 3),
        missingSkills: [],
        suggestions: ['Highlight core problem solving and project experience.'],
        fitLevel: 'Strong Fit'
      };
    }

    const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());
    const matched: string[] = [];
    const missing: string[] = [];

    for (const skill of jobSkills) {
      const lower = skill.toLowerCase().trim();
      if (normalizedUserSkills.some((u) => u.includes(lower) || lower.includes(u))) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    }

    const ratio = matched.length / jobSkills.length;
    let matchPercentage = Math.round(ratio * 100);

    // Boost score slightly for early career baseline eligibility
    if (matchPercentage < 50 && userSkills.length >= 3) {
      matchPercentage += 25;
    } else if (matchPercentage < 75 && userSkills.length >= 5) {
      matchPercentage += 15;
    }
    matchPercentage = Math.min(98, Math.max(45, matchPercentage));

    let fitLevel: 'Strong Fit' | 'Moderate Fit' | 'Growth Opportunity' = 'Moderate Fit';
    if (matchPercentage >= 80) fitLevel = 'Strong Fit';
    else if (matchPercentage < 65) fitLevel = 'Growth Opportunity';

    const suggestions: string[] = [];
    if (missing.length > 0) {
      suggestions.push(`Consider adding projects demonstrating ${missing.slice(0, 2).join(' and ')}.`);
    }
    suggestions.push(`Emphasize relevant coursework and hands-on GitHub repositories on your profile.`);

    return {
      matchPercentage,
      matchedSkills: matched,
      missingSkills: missing,
      suggestions,
      fitLevel
    };
  }
}
