import { getLanguage } from './util/index'
import { UNION_TYPE, ACTION_TYPE } from './type'

const UNKNOWN = 'unknown'
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

function report(data: any, reportType: UNION_TYPE = UNKNOWN, actionType: ACTION_TYPE = ACTION_TYPE.AUTO) {
  const commonMetric: CommonMetric = {
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

  const reportData = Object.assign({ reportType, actionType }, commonMetric, data)
  console.log(reportData);
}

export default report
