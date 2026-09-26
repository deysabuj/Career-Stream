import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class ApolloConnector implements JobConnector {
  companyName = 'Apollo Hospitals';
  companySlug = 'apollo';
  careerPageUrl = 'https://www.apollohospitals.com/careers';
  logoUrl = '/logos/apollo.png';
  industry = 'Healthcare & Pharmaceuticals';
  description = 'Apollo Hospitals Enterprise Limited is an Indian multinational healthcare group headquartered in Chennai.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[ApolloConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
