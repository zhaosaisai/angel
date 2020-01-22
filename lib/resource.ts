import report from './report'
import { setDefault0 } from './util/index'
import getPerformance from './util/get-performance'
import { REPORT_TYPE } from './type'

const STATIC_TAG = ['script', 'link', 'img']
const LABEL = 'resource'

function getResourceTiming(timing: PerformanceResourceTiming) {
  const {
    domainLookupEnd,
    domainLookupStart,
    connectEnd,
    connectStart,
    secureConnectionStart,
    responseStart,
    requestStart,
    responseEnd,
    fetchStart,
    duration,
    name,
  } = timing

  return {
    dns: setDefault0(domainLookupEnd, domainLookupStart),
    tcp: setDefault0(connectEnd, connectStart),
    ssl: setDefault0(connectEnd, secureConnectionStart),
    ttfb: setDefault0(responseStart, requestStart),
    trans: setDefault0(responseEnd, responseStart),
    fpt: setDefault0(responseEnd, fetchStart),
    duration: duration.toFixed(0),
    url: name,
  }
}

function getResourceMetric(entries: PerformanceResourceTiming[]) {
  return entries.map((entry) => getResourceTiming(entry))
}

function reportResource(perf: any) {
  const entries: PerformanceResourceTiming[] = (perf.getEntriesByType(LABEL) as PerformanceResourceTiming[]).filter((entry: any) => STATIC_TAG.indexOf(entry.initiatorType))
  if (entries.length > 0) {
    report(getResourceMetric(entries), REPORT_TYPE.RESOURCE)
  }
}

function getEntryTypes(performance: Performance) {
  if (window.PerformanceObserver) {
    const observer = new PerformanceObserver(perf => {
      reportResource(perf)
    })
    observer.observe({
      entryTypes: [LABEL]
    })
  } else {
    window.addEventListener('load', function() {
      // why
      // const entries: PerformanceResourceTiming[] = (performance.getEntriesByType(LABEL) as PerformanceResourceTiming[]).filter((entry: any) => STATIC_TAG.indexOf(entry.initiatorType))
      // report(getResourceMetric(entries), REPORT_TYPE.RESOURCE)
      reportResource(performance)
    })
  }
}


function monitorResource() {
  const performance = getPerformance()
  if (performance && performance.timing && performance.timing.loadEventEnd) {
    reportResource(performance)
  } else {
    getEntryTypes(performance)
  }
}

export default monitorResource
