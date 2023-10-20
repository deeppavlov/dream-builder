import { format } from 'fecha'
import { TLocale } from 'types/types'

export const timeToUTC = (date: Date, locale?: TLocale) => {
  const timeZoneOffset = date.getTimezoneOffset()
  date.setTime(date.getTime() - timeZoneOffset * 60000)
  
  const formats = {
    en: 'hh:mm A',
    ru: 'HH:mm',
  }

  return format(new Date(date), formats[locale ?? 'en'])
}
