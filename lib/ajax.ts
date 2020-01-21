import { validateStatus } from './util/index'
import { NETWORK_ERROR } from './type'

declare global {
  interface XMLHttpRequest {
    _hooks: any
  }
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
    const e: any = {}
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
        if (!validateStatus(status)) {
          Object.assign(e, {
            duration: new Date().getTime() - startTime,
            url: responseURL,
            status,
            statusText,
            errorType: NETWORK_ERROR.REQUEST_ERROR
          }, this._hooks)
        }
      }

      if (typeof onreadystatechange === 'function') {
        onreadystatechange.apply(this, args)
      }
    }


    return _xhrRealSend.apply(this, args)
  }
}

export default monitorAjax
