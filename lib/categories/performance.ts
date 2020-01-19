import Monitor from './base'

interface PerformanceMetric {
  // 阶段耗时
  dns: number;
  tcp: number;
  ssl: number;
  ttfb: number;
  trans: number;
  dom: number;
  res: number;
  // 关键性能指标
  firstbyte: number;
  fpt: number;
  tti: number;
  ready: number;
  load: number;
}

class Performance extends Monitor {
  constructor() {
    super()
  }
}

export default Performance
