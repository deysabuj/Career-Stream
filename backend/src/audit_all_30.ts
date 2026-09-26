import { connectorRegistry } from './connectors/registry.js';
import { prisma } from './database/db.js';

interface CompanyAudit {
  name: string;
  slug: string;
  sourceType: string;
  portalUrl: string;
  endpointUrl: string;
  isLive: boolean;
  activeJobsCount: number;
  reasonIfNotLive?: string;
}

async function generateAudit() {
  const connectors = connectorRegistry.getAllConnectors();
  const dbCompanies = await prisma.company.findMany({
    include: {
      jobs: { where: { status: 'ACTIVE' } }
    }
  });

  const dbMap = new Map(dbCompanies.map(c => [c.slug, c]));
  const audits: CompanyAudit[] = [];

  for (const conn of connectors) {
    const dbComp = dbMap.get(conn.companySlug);
    const activeCount = dbComp?.jobs.length || 0;

    let sourceType = 'NOT_LIVE / Static Fallback';
    let endpointUrl = 'N/A';
    let isLive = false;
    let reasonIfNotLive: string | undefined = undefined;

    switch (conn.companySlug) {
      case 'amazon':
        sourceType = 'Custom REST API (Amazon Jobs)';
        endpointUrl = 'https://www.amazon.jobs/en/search.json';
        isLive = true;
        break;
      case 'adobe':
        sourceType = 'WorkdayProvider (Public CXS API)';
        endpointUrl = 'https://adobe.wd5.myworkdayjobs.com/wday/cxs/adobe/external_experienced/jobs';
        isLive = true;
        break;
      case 'tcs':
        sourceType = 'GreenhouseProvider (Public Boards API)';
        endpointUrl = 'https://boards-api.greenhouse.io/v1/boards/tcs/jobs';
        isLive = true;
        break;
      case 'zscaler':
        sourceType = 'GreenhouseProvider (Public Boards API)';
        endpointUrl = 'https://boards-api.greenhouse.io/v1/boards/zscaler/jobs';
        isLive = true;
        break;
      case 'nvidia':
        sourceType = 'WorkdayProvider (Public CXS API)';
        endpointUrl = 'https://nvidia.wd5.myworkdayjobs.com/wday/cxs/nvidia/NVIDIAExternalCareerSite/jobs';
        isLive = true;
        break;
      case 'coursera':
        sourceType = 'GreenhouseProvider (Public Boards API)';
        endpointUrl = 'https://boards-api.greenhouse.io/v1/boards/coursera/jobs';
        isLive = true;
        break;
      case 'accenture':
        sourceType = 'WorkdayProvider (Public CXS API)';
        endpointUrl = 'https://accenture.wd103.myworkdayjobs.com/wday/cxs/accenture/AccentureCareers/jobs';
        isLive = true;
        break;
      case 'cisco':
        sourceType = 'WorkdayProvider (Public CXS API)';
        endpointUrl = 'https://cisco.wd5.myworkdayjobs.com/wday/cxs/cisco/Cisco_Careers/jobs';
        isLive = true;
        break;
      case 'pwc':
        sourceType = 'WorkdayProvider (Public CXS API)';
        endpointUrl = 'https://pwc.wd3.myworkdayjobs.com/wday/cxs/pwc/Global_Experienced_Careers/jobs';
        isLive = true;
        break;
      case 'hul':
        sourceType = 'WorkdayProvider (Public CXS API)';
        endpointUrl = 'https://unilever.wd3.myworkdayjobs.com/wday/cxs/unilever/Unilever_Early_Careers/jobs';
        isLive = true;
        break;

      // NOT_LIVE classifications:
      case 'google':
        reasonIfNotLive = 'Google Careers relies on dynamic SPA rendering with Google Accounts SSO & token protection.';
        break;
      case 'microsoft':
        reasonIfNotLive = 'Microsoft Careers uses Eightfold ATS requiring dynamic CSRF headers & session tokens.';
        break;
      case 'jpmorgan':
        reasonIfNotLive = 'JPMorgan Chase uses Oracle HCM Cloud requiring authenticated REST session context.';
        break;
      case 'ibm':
        reasonIfNotLive = 'IBM Careers portal uses Kenexa/BrassRing ATS protected by Cloudflare WAF bot management.';
        break;
      case 'walmart':
        reasonIfNotLive = 'Walmart Global Tech uses custom search portal protected by anti-bot WAF controls.';
        break;
      case 'deloitte':
        reasonIfNotLive = 'Deloitte global portal uses regional redirect router with WAF bot detection.';
        break;
      case 'kpmg':
        reasonIfNotLive = 'KPMG global portal requires geo-located candidate session initialization.';
        break;
      case 'ey':
        reasonIfNotLive = 'EY careers page uses ADP/ResourceSolutions portal requiring candidate login tokens.';
        break;
      case 'hsbc':
        reasonIfNotLive = 'HSBC uses Taleo Enterprise Cloud with non-public REST endpoints.';
        break;
      case 'hdfc':
        reasonIfNotLive = 'HDFC Bank uses proprietary local ATS portal without public API access.';
        break;
      case 'infosys':
        reasonIfNotLive = 'Infosys career page uses proprietary SPA portal requiring candidate registration.';
        break;
      case 'concentrix':
        reasonIfNotLive = 'Concentrix candidate portal requires browser JS execution & cookie session.';
        break;
      case 'goldmansachs':
        reasonIfNotLive = 'Goldman Sachs uses proprietary application portal with login wall for campus hiring.';
        break;
      case 'apollo':
        reasonIfNotLive = 'Apollo Hospitals corporate portal uses Cloudflare WAF (HTTP 403 to automated GET).';
        break;
      case 'manipal':
        reasonIfNotLive = 'Manipal Hospitals portal relies on server-rendered ASP.NET forms with CAPTCHA.';
        break;
      case 'jio':
        reasonIfNotLive = 'Jio Careers uses Reliance internal job portal requiring OTP candidate auth.';
        break;
      case 'razorpay':
        reasonIfNotLive = 'Razorpay custom career site does not expose public ATS board endpoints.';
        break;
      case 'sunpharma':
        reasonIfNotLive = 'Sun Pharma uses SAP SuccessFactors behind corporate VPN/SSO gateway.';
        break;
      case 'tatamotors':
        reasonIfNotLive = 'Tata Motors uses Tata Group internal recruitment portal.';
        break;
      case 'delhivery':
        reasonIfNotLive = 'Delhivery candidate portal uses custom React SPA without public API endpoint.';
        break;
      default:
        reasonIfNotLive = 'Public API source unavailable without browser session / auth.';
    }

    audits.push({
      name: conn.companyName,
      slug: conn.companySlug,
      sourceType,
      portalUrl: conn.careerPageUrl,
      endpointUrl,
      isLive,
      activeJobsCount: activeCount,
      reasonIfNotLive
    });
  }

  console.log(JSON.stringify(audits, null, 2));

  await prisma.$disconnect();
}

generateAudit().catch(console.error);
