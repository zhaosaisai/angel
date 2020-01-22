import report from './report'
import { validateStatus } from './util/index'
import { NETWORK_ERROR, REPORT_TYPE, ERROR_TYPE } from './type'

declare global {
  interface XMLHttpRequest {
    _hooks: any
  }
}

function reportAjaxError(event: any, subtype: string) {
  const { loaded, total, lengthComputable } = event
  report(Object.assign({
    type: ERROR_TYPE.AJAX_ERROR,
    subtype,
    loaded,
    total,
    lengthComputable,
  }), REPORT_TYPE.INTERFACE)
}

function monitorAjax() {
  const _xhrRealSend = XMLHttpRequest.prototype.send
  const _xhrRealOpen = XMLHttpRequest.prototype.open

  XMLHttpRequest.prototype.open = function(...args: any[]) {
    this._hooks = {
      method: args[0],
      path: args[1],
    }
    return _xhrRealOpen.apply(this, args as any)
  }

  XMLHttpRequest.prototype.send = function(...args) {
    const startTime = new Date().getTime()

    const { onerror, ontimeout, onabort, onreadystatechange } = this

    this.onreadystatechange = function (...args) {
      const {
        readyState,
        DONE,
        status,
        responseURL,
        statusText
      } = this
      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (readyState === DONE && status !== 0 && (responseURL && responseURL.match(/^https?:\/\//))) {
        // TODO: set as a global var
        const e: any = Object.assign({}, this._hooks)
        const duration = new Date().getTime() - startTime
        if (!validateStatus(status)) {
          Object.assign(e, {
            duration,
            url: responseURL,
            status,
            statusText,
            type: ERROR_TYPE.AJAX_ERROR,
            subtype: NETWORK_ERROR.REQUEST_ERROR
          })
          report(e, REPORT_TYPE.INTERFACE)
        } else if (duration > 300) {
          // 慢接口 + 响应体大小
          Object.assign(e, {
            duration,
            url: responseURL,
            status,
            type: ERROR_TYPE.AJAX_ERROR,
            subtype: NETWORK_ERROR.SLOW_API
          })
          report(e, REPORT_TYPE.INTERFACE)
        }
      }

      if (typeof onreadystatechange === 'function') {
        onreadystatechange.apply(this, args)
      }
    }

    this.onerror = function(event) {
      reportAjaxError(event, NETWORK_ERROR.ERROR)
      if (typeof onerror === 'function') {
        onerror.call(this, event)
      }
    }

    this.onabort = function(event) {
      reportAjaxError(event, NETWORK_ERROR.ABORT)
      if (typeof onabort === 'function') {
        onabort.call(this, event)
      }
    }

    this.ontimeout = function(event) {
      reportAjaxError(event, NETWORK_ERROR.TIMEOUT)

      if (typeof ontimeout === 'function') {
        ontimeout.call(this, event)
      }
    }
    return _xhrRealSend.apply(this, args)
  }
}

export default monitorAjax
