export enum REPORT_TYPE {
  PERFORMANCE = 'performance',
  RESOURCE = 'resource',
  ERROR = 'error',
  INTERFACE = 'interface',
  UNKNOWN = 'unknown'
}

export enum ACTION_TYPE {
  AUTO = 0, // 自动上报
  MANUAL = 1, // 手动上报
  UNKNOWN = 'unknown'
}
