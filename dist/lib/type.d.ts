export declare enum REPORT_TYPE {
    PERFORMANCE = "performance",
    RESOURCE = "resource",
    ERROR = "error",
    INTERFACE = "interface",
    UNKNOWN = "unknown"
}
export declare enum ACTION_TYPE {
    AUTO = 0,
    MANUAL = 1,
    UNKNOWN = "unknown"
}
export declare enum ERROR_TYPE {
    JS_ERROR = "js_error",
    RESOURCE_ERROR = "resource_error",
    UNHANDLEDREJECTION = "unhandledrejection",
    AJAX_ERROR = "ajax_error",
    FETCH_ERROR = "fetch_error"
}
export declare enum NETWORK_ERROR {
    REQUEST_ERROR = "request_error",
    TIMEOUT = "timout",
    ERROR = "network_error",
    ABORT = "abort",
    SLOW_API = "slow_api"
}
export declare type UNKNOWN = 'unknown';
export declare type UNION_TYPE = REPORT_TYPE | ACTION_TYPE | ERROR_TYPE | UNKNOWN;
