import s from './PageErrorHandler.module.scss'

interface IProps {
  statusCode: string
  message?: string
}

const PageErrorHandler = ({ statusCode, message }: IProps) => {
  return <div className={s.pageErrorHandler}>{statusCode} {message}</div>
}

export default PageErrorHandler
