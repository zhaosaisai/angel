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


export enum ERROR_TYPE {
  JS_ERROR = 'js_error', // JavaScript运行时的错误
  RESOURCE_ERROR = 'resource_error', // 静态资源加载错误
  UNHANDLEDREJECTION = 'unhandledrejection', // Promise未捕获的错误
  AJAX_ERROR = 'ajax_error', // ajax请求错误
  FETCH_ERROR = 'fetch_error' // fetch请求错误
}

export enum NETWORK_ERROR {
  REQUEST_ERROR = 'request_error', // 请求出错
  TIMEOUT = 'timout', // 超时
  ERROR = 'network_error', // 网络出错
  ABORT = 'abort', // 用户取消
}

export type UNKNOWN = 'unknown'

export type UNION_TYPE = REPORT_TYPE | ACTION_TYPE | ERROR_TYPE | UNKNOWN
