import getPerformance from './get-performance'

declare global {
  interface Navigator {
    userLanguage: string
  }
}
export const getLanguage = (): string => {
  const languages = navigator.languages || navigator.language || navigator.userLanguage
  return Array.isArray(languages) ? languages[0] : languages
}

export const setDefault0 = (end: number, start: number): number => {
  return (end > 0 && start > 0) ? (end - start) : 0
}

export const getPerformanceMetric = (endTag: string, startTag: string): number => {
  const performance = getPerformance() as any
  if (!performance) {
    return 0
  }

  const timing = performance.timing
  return setDefault0(timing[endTag], timing[startTag])
}

export const isScriptError = (message: string): boolean => {
  const SCRIPT_ERROR = 'script error'
  return message.toLocaleLowerCase().indexOf(SCRIPT_ERROR) > -1
}
