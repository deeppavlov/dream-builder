import { ReactComponent as SuccesSVG } from '../../assets/icons/success.svg'
import s from './Toasts.module.scss'

const BaseToast = ({ children }: any) => {
  return <div className={s.baseToast}>{children}</div>
}

export const ToastCopySucces = () => {
  return (
    <BaseToast>
      <div className={s.succes}>
        <SuccesSVG />
        Copied!
      </div>
    </BaseToast>
  )
}
