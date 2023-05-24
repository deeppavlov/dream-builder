import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'
import { useObserver } from '../../hooks/useObserver'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { ToastCopySucces } from '../Toasts/Toasts'
import s from './ShareAssistantModal.module.scss'

export const ShareAssistantModal = () => {
  const [bot, setBot] = useState<string>('not yet')
  const [isOpen, setIsOpen] = useState(false)
  const cx = classNames.bind(s)
  const handleEventUpdate = (data: any) => {
    setBot(data?.detail?.bot?.name || data?.detail)
    setIsOpen(prev => !prev)
  }
  const { control, getValues, reset } = useForm({
    defaultValues: { link: bot },
  })
  const url = getValues('link')
  const shareText =
    'Check out this Generative Assistant I made with deepdream.builders! '

  const handleCopyBtnClick = () => {
    navigator.clipboard.writeText(url)
    toast.custom(<ToastCopySucces />, {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }

  useObserver('ShareAssistantModal', handleEventUpdate)
  useEffect(() => {
    reset({
      link: `https://assistants.deepdream.builders/?assistant=${bot}`,
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
              <FacebookShareButton
                quote={shareText}
                children={<FacebookIcon />}
                url={url}
              />
              <TwitterShareButton
                title={shareText}
                children={<TwitterIcon />}
                url={url}
              />
              <TelegramShareButton
                title={shareText}
                children={<TelegramIcon />}
                url={url}
              />
              <LinkedinShareButton
                title={shareText}
                children={<LinkedinIcon />}
                url={url}
              />
              <RedditShareButton
                title={shareText}
                children={<RedditIcon />}
                url={url}
              />
            </div>
          </div>
          <p className={cx('text', 'lines')}>or copy link</p>
          <div className={s.bottom}>
            <div className={s.footer}>
              <Input
                name='link'
                control={control}
                big
                props={{ readOnly: true }}
              />
              <Button props={{ onClick: handleCopyBtnClick }} theme='primary'>
                Copy
              </Button>
            </div>
            <a href={url} target='_blank' rel='noopener noreferrer'>
              <Button theme='secondary' long>
                Open in another tab
              </Button>
            </a>
          </div>
        </div>
      </BaseModal>
    </>
  )
}
