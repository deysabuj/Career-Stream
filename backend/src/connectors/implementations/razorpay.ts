import { JobConnector } from '../interface.js';
import { RawJob } from '../../types/index.js';

export class RazorpayConnector implements JobConnector {
  companyName = 'Razorpay';
  companySlug = 'razorpay';
  careerPageUrl = 'https://razorpay.com/jobs/';
  logoUrl = '/logos/razorpay.png';
  industry = 'Fintech & Payment Gateway';
  description = 'Razorpay is a leading Indian fintech platform providing payment gateway and financial software solutions.';

  async fetchJobs(): Promise<RawJob[]> {
    console.log('[RazorpayConnector] Connector is NOT_LIVE (portal unavailable for automated fetching). Returning 0 jobs.');
    return [];
  }
}
