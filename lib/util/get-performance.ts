declare global {
  interface Window {
    mozPerformance: Performance,
    msPerformance: Performance,
    webkitPerformance: Performance,
  }
}

export default function getPerformance() {
  return window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;
}
