import { ReactComponent as LeftArrowIcon } from 'assets/icons/arrow_right_link.svg'
import { TErrorStatus } from 'types/types'
import { errorMessages } from 'utils/errorMessages'
import { Button } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import s from './PageErrorHandler.module.scss'

interface IProps {
  status: TErrorStatus
}

const PageErrorHandler = ({ status }: IProps) => {
  const { title, message } = errorMessages[status]
  return (
    // Fix on SVG
    <div className={s.pageErrorHandler}>
      <div className={s.status}>{status}</div>
      <div className={s['bg-info']}>
        <SvgIcon iconName={`error_${status}`} svgProp={{ className: s.icon }} />
        <div className={s['bg-info-semi-circle']}></div>
        <div className={s.info}>
          <h1 className={s.title}>{title}</h1>
          <p className={s.message}>{message}</p>
          <a href='/'>
            <Button theme='primary'>
              <LeftArrowIcon />
              Back to home
            </Button>
          </a>
        </div>
      </div>
      <div className={s['bg-front-circle']}></div>
      <div className={s['bg-back-circle']}></div>
    </div>
  )
}

export default PageErrorHandler
