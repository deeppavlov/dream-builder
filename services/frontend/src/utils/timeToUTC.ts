import { format } from 'fecha'
import { TLocale } from 'types/types'

export const timeToUTC = (date: any, locale?: TLocale) => {
  const formats = {
    en: 'hh:mm A',
    ru: 'hh:mm',
  }

  return format(new Date(date), formats[locale ?? 'en'])
}
