import { format } from 'fecha'
import { TLocale } from 'types/types'

export const dateToUTC = (
  dateData: any,
  locale?: TLocale,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }
) => {
  const date = new Date(dateData)

  if (!locale || locale == 'en') return format(new Date(date), 'mediumDate')

  const ruFormat = date.toLocaleDateString('ru', options).toString()

  return ruFormat
}
