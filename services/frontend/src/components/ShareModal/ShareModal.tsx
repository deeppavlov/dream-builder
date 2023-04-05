import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import classNames from 'classnames/bind'
import { useForm } from 'react-hook-form'
import { subscribe, unsubscribe } from '../../utils/events'
import BaseModal from '../../ui/BaseModal/BaseModal'
import { Input } from '../../ui/Input/Input'
import Button from '../../ui/Button/Button'
import { ToastCopySucces } from '../Toasts/Toasts'
import { ReactComponent as FB } from '../../assets/icons/facebook.svg'
import { ReactComponent as TW } from '../../assets/icons/twitter.svg'
import s from './ShareModal.module.scss'
import { useObserver } from '../../hooks/useObserver'

export const ShareModal = () => {
  const [bot, setBot] = useState<string>('not yet')
  const [isOpen, setIsOpen] = useState(false)
  const cx = classNames.bind(s)
  const handleEventUpdate = (data: any) => {
    setBot(data?.detail?.bot?.name)
    setIsOpen(!isOpen)
  }
  const { register, getValues, reset } = useForm({
    defaultValues: {
      link: bot,
    },
  })

  const clickHandler = () => {
    navigator.clipboard.writeText(getValues('link'))
    toast.custom(<ToastCopySucces />, {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }

  useObserver('ShareModal', handleEventUpdate)

  useEffect(() => {
    reset({
      link: 'https://assistants.deepdream.builders/?assistant=' + bot,
    })
  }, [bot])
  return (
    <>
      <Toaster />
      <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={s.shareModal}>
          <div className={s.header}>Share It!</div>
          <div className={s.main}>
            <p className={s.text}>Share this with your community</p>
            <div className={s.icons}>
              <FB />
              <TW />
            </div>
          </div>
          <p className={cx('text', 'lines')}>or copy link</p>
          <div className={s.footer}>
            <Input big props={{ ...register('link') }} />
            <Button props={{ onClick: clickHandler }} theme={'primary'}>
              Copy
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  )
}
