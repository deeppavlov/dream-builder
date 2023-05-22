import { TErrorStatus } from '../types/types'

interface IErrorMessage {
  title: string
  message: string
}

type IErrorMessages = {
  [key in TErrorStatus]: IErrorMessage
}

export const errorMessages: IErrorMessages = {
  401: {
    title: 'Hold up!',
    message: 'Unauthorized!',
  },
  404: {
    title: 'Page not found!',
    message:
      'We couldn’t find the page you were looking for. The link you clicked may be broken or the page may have been removed or renamed!',
  },
  500: {
    title: 'Internal Server Error!',
    message:
      'The server has been deserted for a while. Please be patient or try again later.',
  },
  503: {
    title: 'Sorry, we’re under maintenance!',
    message:
      'Hang on till we get the error fixed.  You may also refresh the page or try again later.',
  },
}
