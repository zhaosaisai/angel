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

export const setDefault0 = (end: number, start: number): number | null => {
  return (end > 0 && start > 0) ? (end - start) : null
}

export const getPerformanceMetric = (endTag: string, startTag: string): number | null => {
  const performance = getPerformance() as any

  return setDefault0(performance[endTag], performance[startTag])
}
