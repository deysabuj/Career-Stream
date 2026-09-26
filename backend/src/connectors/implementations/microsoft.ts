import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class MicrosoftConnector implements JobConnector {
  companyName = 'Microsoft';
  companySlug = 'microsoft';
  careerPageUrl = 'https://careers.microsoft.com/';
  logoUrl = '/logos/microsoft.png';
  industry = 'Software, Cloud & AI';
  description = 'Microsoft Corporation is a technology company developing computer software, consumer electronics, and personal computers.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[MicrosoftConnector] Connector is NOT_LIVE (official portal requires non-automated auth). Returning 0 jobs.');
    return [];
  }
}
