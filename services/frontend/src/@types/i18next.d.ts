// import the original type declarations
import 'i18next'
// import all namespaces (for the default language, only)
import trans from '../../public/locales/en/translation.json'

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom resources type
    resources: {
      translation: typeof trans
    }
  }
  // other
}
