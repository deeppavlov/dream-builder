import { format } from 'fecha'

interface date_created {
  date: string | number | Date
}

export const dateToUTC = (date: any) => {
  return format(new Date(date), 'mediumDate')
}
