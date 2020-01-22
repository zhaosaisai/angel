import { getPerformanceMetric } from './util/index'
import getPerformance from './util/get-performance'
import report from './report'
import { REPORT_TYPE } from './type'

declare namespace monitorPerformance {
  export let installed: boolean
}

function monitorPerformance() {
  if (monitorPerformance.installed) {
    return
  }
  monitorPerformance.installed = true

  const performance = getPerformance()

  function getMetrics() {
    return {
      dns: getPerformanceMetric('domainLookupEnd', 'domainLookupStart'),
      tcp: getPerformanceMetric('connectEnd', 'connectStart'),
      ssl: getPerformanceMetric('connectEnd', 'secureConnectionStart'),
      ttfb: getPerformanceMetric('responseStart', 'requestStart'),
      trans: getPerformanceMetric('responseEnd', 'responseStart'),
      dom: getPerformanceMetric('domInteractive', 'responseEnd'),
      res: getPerformanceMetric('loadEventStart', 'domContentLoadedEventEnd'),
      firstbyte: getPerformanceMetric('responseStart', 'domainLookupStart'),
      fpt: getPerformanceMetric('responseEnd', 'fetchStart'),
      tti: getPerformanceMetric('domInteractive', 'fetchStart'),
      ready: getPerformanceMetric('domContentLoadEventEnd', 'fetchStart'),
      load: getPerformanceMetric('loadEventStart', 'fetchStart'),
    }
  }

  if (performance && performance.timing && performance.timing.loadEventEnd) {
    report(getMetrics(), REPORT_TYPE.PERFORMANCE)
  } else {
    window.addEventListener('load', () => {
      report(getMetrics(), REPORT_TYPE.PERFORMANCE)
    })
  }
}

export default monitorPerformance
