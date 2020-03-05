'use strict';

function getPerformance() {
    return window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;
}

var getLanguage = function () {
    var languages = navigator.languages || navigator.language || navigator.userLanguage;
    return Array.isArray(languages) ? languages[0] : languages;
};
var setDefault0 = function (end, start) {
    return (end > 0 && start > 0) ? (end - start) : 0;
};
var getPerformanceMetric = function (endTag, startTag) {
    var performance = getPerformance();
    if (!performance) {
        return 0;
    }
    var timing = performance.timing;
    return setDefault0(timing[endTag], timing[startTag]);
};
var getStaticAttrs = function (target) {
    var name = target.localName;
    switch (name) {
        case 'script':
            return {
                url: target.src,
                async: target.async,
                defer: target.defer
            };
        case 'link':
            return {
                url: target.href
            };
        case 'img':
            return {
                url: target.src
            };
    }
    return {};
};
var isError = function (error) { return error instanceof Error; };
var validateStatus = function (status) { return status >= 200 && status < 300; };

var REPORT_TYPE;
(function (REPORT_TYPE) {
    REPORT_TYPE["PERFORMANCE"] = "performance";
    REPORT_TYPE["RESOURCE"] = "resource";
    REPORT_TYPE["ERROR"] = "error";
    REPORT_TYPE["INTERFACE"] = "interface";
    REPORT_TYPE["UNKNOWN"] = "unknown";
})(REPORT_TYPE || (REPORT_TYPE = {}));
var ACTION_TYPE;
(function (ACTION_TYPE) {
    ACTION_TYPE[ACTION_TYPE["AUTO"] = 0] = "AUTO";
    ACTION_TYPE[ACTION_TYPE["MANUAL"] = 1] = "MANUAL";
    ACTION_TYPE["UNKNOWN"] = "unknown";
})(ACTION_TYPE || (ACTION_TYPE = {}));
var ERROR_TYPE;
(function (ERROR_TYPE) {
    ERROR_TYPE["JS_ERROR"] = "js_error";
    ERROR_TYPE["RESOURCE_ERROR"] = "resource_error";
    ERROR_TYPE["UNHANDLEDREJECTION"] = "unhandledrejection";
    ERROR_TYPE["AJAX_ERROR"] = "ajax_error";
    ERROR_TYPE["FETCH_ERROR"] = "fetch_error"; // fetch请求错误
})(ERROR_TYPE || (ERROR_TYPE = {}));
var NETWORK_ERROR;
(function (NETWORK_ERROR) {
    NETWORK_ERROR["REQUEST_ERROR"] = "request_error";
    NETWORK_ERROR["TIMEOUT"] = "timout";
    NETWORK_ERROR["ERROR"] = "network_error";
    NETWORK_ERROR["ABORT"] = "abort";
    NETWORK_ERROR["SLOW_API"] = "slow_api"; // 慢接口
})(NETWORK_ERROR || (NETWORK_ERROR = {}));

var UNKNOWN = 'unknown';
function report(data, reportType, actionType) {
    if (reportType === void 0) { reportType = UNKNOWN; }
    if (actionType === void 0) { actionType = ACTION_TYPE.AUTO; }
    var commonMetric = {
        app: '',
        href: location.href,
        language: getLanguage(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        colorDepth: window.screen.colorDepth,
        referrer: document.referrer,
    };
    var reportData = Object.assign({ reportType: reportType, actionType: actionType }, commonMetric, data);
    console.log(reportData);
}

function monitorPerformance() {
    if (monitorPerformance.installed) {
        return;
    }
    monitorPerformance.installed = true;
    var performance = getPerformance();
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
        };
    }
    if (performance && performance.timing && performance.timing.loadEventEnd) {
        report(getMetrics(), REPORT_TYPE.PERFORMANCE);
    }
    else {
        window.addEventListener('load', function () {
            report(getMetrics(), REPORT_TYPE.PERFORMANCE);
        });
    }
}

function formatError(error) {
    if (!isError(error))
        return error;
    var col = error.column || error.columnNumber;
    var row = error.line || error.lineNumber;
    var message = error.message;
    var name = error.name;
    var stack = error.stack;
    var errorData = {
        col: col,
        row: row,
        message: message,
        name: name,
        stack: stack,
        scriptSrc: ''
    };
    if (stack) {
        var linkReg = /https?:\/\/[^\n]+/;
        var matchLink = stack.match(linkReg);
        if (matchLink) {
            var matchedUrl = matchLink[0];
            var stackRow_1 = 0;
            var stackCol_1 = 0;
            var scriptSrc = matchedUrl.replace(/:(\d+):(\d+)/, function (_, $1, $2) {
                stackRow_1 = $1;
                stackCol_1 = $2;
                return '';
            });
            Object.assign(errorData, {
                col: Number(stackRow_1 || col),
                row: Number(stackCol_1 || row),
                scriptSrc: scriptSrc
            });
        }
    }
    return errorData;
}

function monitorError() {
    // JavaScript runtime error
    window.onerror = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var message = args[0], scriptSrc = args[1], line = args[2], column = args[3], error = args[4];
        var e = {};
        if (isError(error)) {
            var _e = formatError(error);
            e.message = _e.message || message;
            e.url = _e.scriptSrc || scriptSrc;
            e.row = _e.row || line;
            e.col = _e.col || column;
            e.stack = _e.stack;
            e.name = _e.name;
        }
        else {
            e.message = message;
            e.url = scriptSrc;
            e.row = line;
            e.col = column;
            e.stack = 'unknown stack';
            e.name = 'unknown error type';
            if (error) {
                e.error = JSON.stringify(error);
            }
        }
        report(e, ERROR_TYPE.JS_ERROR);
    };
    // resource load error
    window.addEventListener('error', function (event) {
        var target = event.target;
        if (!target || target === window)
            return;
        var e = {};
        var name = target.localName;
        e.message = name + " load error";
        e.type = event.type;
        e.name = name;
        Object.assign(e, getStaticAttrs(target));
        report(e, ERROR_TYPE.RESOURCE_ERROR);
    }, true);
    // promise uncaught error
    window.addEventListener('unhandledrejection', function (event) {
        var reason = event && event.reason;
        var e = {};
        if (typeof reason !== 'object') {
            e.message = String(reason) || '';
        }
        else if (reason instanceof Error) {
            var _e = formatError(reason);
            e.message = _e.message;
            e.url = _e.scriptSrc;
            e.row = _e.row;
            e.col = _e.col;
            e.stack = _e.stack;
            e.name = _e.name;
        }
        else {
            e.message = JSON.stringify(reason);
        }
    });
}

function reportAjaxError(event, subtype) {
    var loaded = event.loaded, total = event.total, lengthComputable = event.lengthComputable;
    report(Object.assign({
        type: ERROR_TYPE.AJAX_ERROR,
        subtype: subtype,
        loaded: loaded,
        total: total,
        lengthComputable: lengthComputable,
    }), REPORT_TYPE.INTERFACE);
}
function monitorAjax() {
    var _xhrRealSend = XMLHttpRequest.prototype.send;
    var _xhrRealOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._hooks = {
            method: args[0],
            path: args[1],
        };
        return _xhrRealOpen.apply(this, args);
    };
    XMLHttpRequest.prototype.send = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var startTime = new Date().getTime();
        var _a = this, onerror = _a.onerror, ontimeout = _a.ontimeout, onabort = _a.onabort, onreadystatechange = _a.onreadystatechange;
        this.onreadystatechange = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = this, readyState = _a.readyState, DONE = _a.DONE, status = _a.status, responseURL = _a.responseURL, statusText = _a.statusText;
            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (readyState === DONE && status !== 0 && (responseURL && responseURL.match(/^https?:\/\//))) {
                // TODO: set as a global var
                var e = Object.assign({}, this._hooks);
                var duration = new Date().getTime() - startTime;
                if (!validateStatus(status)) {
                    Object.assign(e, {
                        duration: duration,
                        url: responseURL,
                        status: status,
                        statusText: statusText,
                        type: ERROR_TYPE.AJAX_ERROR,
                        subtype: NETWORK_ERROR.REQUEST_ERROR
                    });
                    report(e, REPORT_TYPE.INTERFACE);
                }
                else if (duration > 300) {
                    // 慢接口 + 响应体大小
                    Object.assign(e, {
                        duration: duration,
                        url: responseURL,
                        status: status,
                        type: ERROR_TYPE.AJAX_ERROR,
                        subtype: NETWORK_ERROR.SLOW_API
                    });
                    report(e, REPORT_TYPE.INTERFACE);
                }
            }
            if (typeof onreadystatechange === 'function') {
                onreadystatechange.apply(this, args);
            }
        };
        this.onerror = function (event) {
            reportAjaxError(event, NETWORK_ERROR.ERROR);
            if (typeof onerror === 'function') {
                onerror.call(this, event);
            }
        };
        this.onabort = function (event) {
            reportAjaxError(event, NETWORK_ERROR.ABORT);
            if (typeof onabort === 'function') {
                onabort.call(this, event);
            }
        };
        this.ontimeout = function (event) {
            reportAjaxError(event, NETWORK_ERROR.TIMEOUT);
            if (typeof ontimeout === 'function') {
                ontimeout.call(this, event);
            }
        };
        return _xhrRealSend.apply(this, args);
    };
}

var STATIC_TAG = ['script', 'link', 'img'];
var LABEL = 'resource';
function getResourceTiming(timing) {
    var domainLookupEnd = timing.domainLookupEnd, domainLookupStart = timing.domainLookupStart, connectEnd = timing.connectEnd, connectStart = timing.connectStart, secureConnectionStart = timing.secureConnectionStart, responseStart = timing.responseStart, requestStart = timing.requestStart, responseEnd = timing.responseEnd, fetchStart = timing.fetchStart, duration = timing.duration, name = timing.name;
    return {
        dns: setDefault0(domainLookupEnd, domainLookupStart),
        tcp: setDefault0(connectEnd, connectStart),
        ssl: setDefault0(connectEnd, secureConnectionStart),
        ttfb: setDefault0(responseStart, requestStart),
        trans: setDefault0(responseEnd, responseStart),
        fpt: setDefault0(responseEnd, fetchStart),
        duration: duration.toFixed(0),
        url: name,
    };
}
function getResourceMetric(entries) {
    return entries.map(function (entry) { return getResourceTiming(entry); });
}
function reportResource(perf) {
    var entries = perf.getEntriesByType(LABEL).filter(function (entry) { return STATIC_TAG.indexOf(entry.initiatorType); });
    if (entries.length > 0) {
        report(getResourceMetric(entries), REPORT_TYPE.RESOURCE);
    }
}
function getEntryTypes(performance) {
    if (window.PerformanceObserver) {
        var observer = new PerformanceObserver(function (perf) {
            reportResource(perf);
        });
        observer.observe({
            entryTypes: [LABEL]
        });
    }
    else {
        window.addEventListener('load', function () {
            // why
            // const entries: PerformanceResourceTiming[] = (performance.getEntriesByType(LABEL) as PerformanceResourceTiming[]).filter((entry: any) => STATIC_TAG.indexOf(entry.initiatorType))
            // report(getResourceMetric(entries), REPORT_TYPE.RESOURCE)
            reportResource(performance);
        });
    }
}
function monitorResource() {
    var performance = getPerformance();
    if (performance && performance.timing && performance.timing.loadEventEnd) {
        reportResource(performance);
    }
    else {
        getEntryTypes(performance);
    }
}

function Monitor(config) {
    this.config = config;
}
Monitor.prototype.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
        return this;
    }
    if (typeof plugin.install === 'function') {
        plugin.install.call(null, this.config, this);
    }
    else if (typeof plugin === 'function') {
        plugin.call(null, this.config, this);
    }
    else {
        console.warn('plugin should be a function or an object with install method');
    }
    installedPlugins.push(plugin);
    return this;
};
window.__monitor__ = function (config) {
    return new Monitor(config)
        .use(monitorPerformance)
        .use(monitorError)
        .use(monitorAjax)
        .use(monitorResource);
};

module.exports = Monitor;
