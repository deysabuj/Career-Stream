export interface CompanyBrowserConfig {
  companySlug: string;
  companyName: string;
  careerPageUrl: string;
  listingSelector?: string;
  jobCardSelector?: string;
  titleSelector?: string;
  locationSelector?: string;
  linkSelector?: string;
  descriptionSelector?: string;
  experienceSelector?: string;
  paginationNextSelector?: string;
  maxPages?: number;
  waitForSelector?: string;
  sourceType: 'PUBLIC_BROWSER';
}
