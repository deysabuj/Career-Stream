import { CompanyBrowserConfig } from './types.js';

export const companyBrowserConfigs: Record<string, CompanyBrowserConfig> = {
  google: {
    companySlug: 'google',
    companyName: 'Google',
    careerPageUrl: 'https://careers.google.com/jobs/results/',
    jobCardSelector: 'li.gc-card',
    titleSelector: 'h2.gc-card__title',
    locationSelector: '.gc-card__location',
    linkSelector: 'a.gc-card__title-link',
    sourceType: 'PUBLIC_BROWSER'
  },
  microsoft: {
    companySlug: 'microsoft',
    companyName: 'Microsoft',
    careerPageUrl: 'https://jobs.careers.microsoft.com/global/en/search',
    jobCardSelector: '.ms-List-cell',
    titleSelector: 'h2',
    locationSelector: '.ms-JobLocation',
    sourceType: 'PUBLIC_BROWSER'
  },
  ibm: {
    companySlug: 'ibm',
    companyName: 'IBM',
    careerPageUrl: 'https://www.ibm.com/careers/search',
    jobCardSelector: '.bx--card',
    titleSelector: '.bx--card__title',
    sourceType: 'PUBLIC_BROWSER'
  },
  walmart: {
    companySlug: 'walmart',
    companyName: 'Walmart Global Tech',
    careerPageUrl: 'https://careers.walmart.com/results',
    jobCardSelector: '.search-result-item',
    titleSelector: '.job-title',
    sourceType: 'PUBLIC_BROWSER'
  },
  jpmorgan: {
    companySlug: 'jpmorgan',
    companyName: 'JPMorgan Chase & Co.',
    careerPageUrl: 'https://careers.jpmorganchase.com/us/en/search-results',
    sourceType: 'PUBLIC_BROWSER'
  },
  deloitte: {
    companySlug: 'deloitte',
    companyName: 'Deloitte',
    careerPageUrl: 'https://www.deloitte.com/careers',
    sourceType: 'PUBLIC_BROWSER'
  },
  ey: {
    companySlug: 'ey',
    companyName: 'EY (Ernst & Young)',
    careerPageUrl: 'https://www.ey.com/en_gl/careers',
    sourceType: 'PUBLIC_BROWSER'
  },
  kpmg: {
    companySlug: 'kpmg',
    companyName: 'KPMG',
    careerPageUrl: 'https://home.kpmg/xx/en/home/careers.html',
    sourceType: 'PUBLIC_BROWSER'
  },
  hsbc: {
    companySlug: 'hsbc',
    companyName: 'HSBC',
    careerPageUrl: 'https://www.hsbc.com/careers',
    sourceType: 'PUBLIC_BROWSER'
  },
  goldmansachs: {
    companySlug: 'goldmansachs',
    companyName: 'Goldman Sachs',
    careerPageUrl: 'https://www.goldmansachs.com/careers/',
    sourceType: 'PUBLIC_BROWSER'
  },
  infosys: {
    companySlug: 'infosys',
    companyName: 'Infosys',
    careerPageUrl: 'https://career.infosys.com/',
    sourceType: 'PUBLIC_BROWSER'
  },
  concentrix: {
    companySlug: 'concentrix',
    companyName: 'Concentrix',
    careerPageUrl: 'https://jobs.concentrix.com/',
    sourceType: 'PUBLIC_BROWSER'
  },
  hdfc: {
    companySlug: 'hdfc',
    companyName: 'HDFC Bank',
    careerPageUrl: 'https://www.hdfcbank.com/personal/about-us/careers',
    sourceType: 'PUBLIC_BROWSER'
  },
  apollo: {
    companySlug: 'apollo',
    companyName: 'Apollo Hospitals',
    careerPageUrl: 'https://www.apollohospitals.com/careers',
    sourceType: 'PUBLIC_BROWSER'
  },
  manipal: {
    companySlug: 'manipal',
    companyName: 'Manipal Hospitals',
    careerPageUrl: 'https://www.manipalhospitals.com/careers',
    sourceType: 'PUBLIC_BROWSER'
  },
  jio: {
    companySlug: 'jio',
    companyName: 'Reliance Jio Platforms',
    careerPageUrl: 'https://careers.jio.com/',
    sourceType: 'PUBLIC_BROWSER'
  },
  razorpay: {
    companySlug: 'razorpay',
    companyName: 'Razorpay',
    careerPageUrl: 'https://razorpay.com/jobs/',
    sourceType: 'PUBLIC_BROWSER'
  },
  sunpharma: {
    companySlug: 'sunpharma',
    companyName: 'Sun Pharma',
    careerPageUrl: 'https://www.sunpharma.com/careers',
    sourceType: 'PUBLIC_BROWSER'
  },
  tatamotors: {
    companySlug: 'tatamotors',
    companyName: 'Tata Motors',
    careerPageUrl: 'https://www.tatamotors.com/careers/',
    sourceType: 'PUBLIC_BROWSER'
  },
  delhivery: {
    companySlug: 'delhivery',
    companyName: 'Delhivery',
    careerPageUrl: 'https://www.delhivery.com/careers',
    sourceType: 'PUBLIC_BROWSER'
  }
};
