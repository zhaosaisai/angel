import formatError from './util/format-error'
import report from './report'
import { ERROR_TYPE } from './type'

function monitorError() {
  // JavaScript runtime error
  window.onerror = function(...args) {
    const [ message, scriptSrc, line, column, error ] = args
    const _e = formatError(error)
    const e: any = {}
    if (_e) {
      e.message = _e.message || message
      e.scriptSrc = _e.scriptSrc || scriptSrc
      e.row = _e.row || line
      e.col = _e.col || column
      e.stack = _e.stack
      e.name = _e.name
    } else {
      e.message = message
      e.scriptSrc = scriptSrc
      e.row = line
      e.col = column
      e.stack = 'unknown stack'
      e.name = 'unknown error type'
    }
    report(e, ERROR_TYPE.JS_ERROR);
  }

  // resource load error
  window.addEventListener('error', function(event) {}, true)
  // promise uncaught error
  window.addEventListener('unhandledrejection', function(event) {})
}

export default monitorError
