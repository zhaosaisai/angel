import { getPerformanceMetric } from './util/index'
import report from './report'
import { REPORT_TYPE, ACTION_TYPE } from './type'

type NumberOrNull = number | null

interface PerformanceMetric {
  // 阶段耗时
  dns: NumberOrNull;
  tcp: NumberOrNull;
  ssl: NumberOrNull;
  ttfb: NumberOrNull;
  trans: NumberOrNull;
  dom: NumberOrNull;
  res: NumberOrNull;
  // 关键性能指标
  firstbyte: NumberOrNull;
  fpt: NumberOrNull;
  tti: NumberOrNull;
  ready: NumberOrNull;
  load: NumberOrNull;
}

declare namespace monitorPerformance {
  export let installed: boolean
}

function monitorPerformance() {
  const metrics: PerformanceMetric = {
    dns: null,
    tcp: null,
    ssl: null,
    ttfb: null,
    trans: null,
    dom: null,
    res: null,
    // 关键性能指标
    firstbyte: null,
    fpt: null,
    tti: null,
    ready: null,
    load: null,
  }

  if (monitorPerformance.installed) {
    return
  }
  monitorPerformance.installed = true

  window.addEventListener('load', () => {
    Object.assign(metrics, {
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
    })

    report(metrics, REPORT_TYPE.PERFORMANCE, ACTION_TYPE.AUTO)
  })
}

export default monitorPerformance
