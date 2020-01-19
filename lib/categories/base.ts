import { getLanguage } from '../util/index'

interface CommonMetric {
  app: string;
  href: string;
  language: string;
  userAgent: string;
  platform: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  referrer: string;
}

class Monitor {
  protected commonMetrics: CommonMetric;
  constructor() {
    this.commonMetrics = {
      app: '',
      href: location.href,
      language: getLanguage(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      colorDepth: window.screen.colorDepth,
      referrer: document.referrer,
    }
  }
}

export default Monitor
