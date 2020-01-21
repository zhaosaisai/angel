import { isError } from './index'
declare global {
  interface Error {
    column?: number;
    columnNumber?: number;
    line?: number;
    lineNumber?: number;
  }
}

export default function formatError(error: any) {
  if (!isError(error)) return error

  const col = error.column || error.columnNumber;
  const row = error.line || error.lineNumber;
  const message = error.message;
  const name = error.name;
  const stack = error.stack

  const errorData = {
    col,
    row,
    message,
    name,
    stack,
    scriptSrc: ''
  }
  if (stack) {
    const linkReg = /https?:\/\/[^\n]+/
    const matchLink = stack.match(linkReg)
    if (matchLink) {
      const matchedUrl = matchLink[0]
      let stackRow = 0
      let stackCol = 0

      const scriptSrc = matchedUrl.replace(/:(\d+):(\d+)/, (_: any, $1: any, $2: any) => {
        stackRow = $1
        stackCol = $2

        return ''
      })
      Object.assign(errorData, {
        col: Number(stackRow || col),
        row: Number(stackCol || row),
        scriptSrc
      })
    }
  }

  return errorData
}
