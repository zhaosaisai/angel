declare global {
  interface Navigator {
    userLanguage: string
  }
}
export const getLanguage = (): string => {
  const languages = navigator.languages || navigator.language || navigator.userLanguage
  return Array.isArray(languages) ? languages[0] : languages
}
