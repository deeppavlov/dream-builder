import { format } from 'fecha'

interface date_created {
  date: string | number | Date
}

export const timeToUTC = (date: any) => {
  return format(new Date(date), 'shortTime')
}
