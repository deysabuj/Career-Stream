import { JobConnector } from './interface.js';
import { GoogleConnector } from './implementations/google.js';
import { MicrosoftConnector } from './implementations/microsoft.js';
import { AmazonConnector } from './implementations/amazon.js';
import { AdobeConnector } from './implementations/adobe.js';
import { InfosysConnector } from './implementations/infosys.js';
import { AccentureConnector } from './implementations/accenture.js';
import { TCSConnector } from './implementations/tcs.js';
import { DeloitteConnector } from './implementations/deloitte.js';
import { KPMGConnector } from './implementations/kpmg.js';
import { EYConnector } from './implementations/ey.js';
import { PwCConnector } from './implementations/pwc.js';
import { JPMorganConnector } from './implementations/jpmorgan.js';
import { ZscalerConnector } from './implementations/zscaler.js';
import { HSBCConnector } from './implementations/hsbc.js';
import { HDFCConnector } from './implementations/hdfc.js';
import { IBMConnector } from './implementations/ibm.js';
import { CiscoConnector } from './implementations/cisco.js';
import { ConcentrixConnector } from './implementations/concentrix.js';
import { NvidiaConnector } from './implementations/nvidia.js';
import { GoldmanSachsConnector } from './implementations/goldmansachs.js';
import { WalmartConnector } from './implementations/walmart.js';
import { ApolloConnector } from './implementations/apollo.js';
import { ManipalConnector } from './implementations/manipal.js';
import { CourseraConnector } from './implementations/coursera.js';
import { HULConnector } from './implementations/hul.js';
import { JioConnector } from './implementations/jio.js';
import { RazorpayConnector } from './implementations/razorpay.js';
import { SunPharmaConnector } from './implementations/sunpharma.js';
import { TataMotorsConnector } from './implementations/tatamotors.js';
import { DelhiveryConnector } from './implementations/delhivery.js';

class ConnectorRegistry {
  private connectors: Map<string, JobConnector> = new Map();

  constructor() {
    this.register(new GoogleConnector());
    this.register(new MicrosoftConnector());
    this.register(new AmazonConnector());
    this.register(new AdobeConnector());
    this.register(new InfosysConnector());
    this.register(new AccentureConnector());
    this.register(new TCSConnector());
    this.register(new DeloitteConnector());
    this.register(new KPMGConnector());
    this.register(new EYConnector());
    this.register(new PwCConnector());
    this.register(new JPMorganConnector());
    this.register(new ZscalerConnector());
    this.register(new HSBCConnector());
    this.register(new HDFCConnector());
    this.register(new IBMConnector());
    this.register(new CiscoConnector());
    this.register(new ConcentrixConnector());
    this.register(new NvidiaConnector());
    this.register(new GoldmanSachsConnector());
    this.register(new WalmartConnector());
    this.register(new ApolloConnector());
    this.register(new ManipalConnector());
    this.register(new CourseraConnector());
    this.register(new HULConnector());
    this.register(new JioConnector());
    this.register(new RazorpayConnector());
    this.register(new SunPharmaConnector());
    this.register(new TataMotorsConnector());
    this.register(new DelhiveryConnector());
  }

  public register(connector: JobConnector) {
    this.connectors.set(connector.companySlug, connector);
  }

  public getConnector(slug: string): JobConnector | undefined {
    return this.connectors.get(slug);
  }

  public getAllConnectors(): JobConnector[] {
    return Array.from(this.connectors.values());
  }
}

export const connectorRegistry = new ConnectorRegistry();
