import formatError from './util/format-error'
import report from './report'
import { ERROR_TYPE } from './type'
import { getStaticAttrs, isError } from './util/index'

function monitorError() {
  // JavaScript runtime error
  window.onerror = function(...args) {
    const [ message, scriptSrc, line, column, error ] = args
    const e: any = {}
    if (isError(error)) {
      const _e = formatError(error)
      e.message = _e.message || message
      e.url = _e.scriptSrc || scriptSrc
      e.row = _e.row || line
      e.col = _e.col || column
      e.stack = _e.stack
      e.name = _e.name
    } else {
      e.message = message
      e.url = scriptSrc
      e.row = line
      e.col = column
      e.stack = 'unknown stack'
      e.name = 'unknown error type'
      if (error) {
        e.error = JSON.stringify(error)
      }
    }
    report(e, ERROR_TYPE.JS_ERROR);
  }

  // resource load error
  window.addEventListener('error', function(event: Event) {
    const target: any = event.target
    if (!target || target === window) return
    const e: any = {}
    const name = target.localName
    e.message = `${name} load error`
    e.type = event.type
    e.name = name
    Object.assign(e, getStaticAttrs(target))
    report(e, ERROR_TYPE.RESOURCE_ERROR)
  }, true)

  // promise uncaught error
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event && event.reason
    const e: any = {}

    if (typeof reason !== 'object') {
      e.message = String(reason) || ''
    } else if (reason instanceof Error) {
      const _e = formatError(reason)
      e.message = _e.message
      e.url = _e.scriptSrc
      e.row = _e.row
      e.col = _e.col
      e.stack = _e.stack
      e.name = _e.name
    } else {
      e.message = JSON.stringify(reason)
    }
  })
}

export default monitorError
