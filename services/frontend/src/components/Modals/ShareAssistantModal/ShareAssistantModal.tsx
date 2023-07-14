import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
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
import { useObserver } from 'hooks/useObserver'
import { Button } from 'components/Buttons'
import { Input } from 'components/Inputs'
import { BaseModal } from 'components/Modals'
import { ToastCopySucces } from 'components/UI'
import s from './ShareAssistantModal.module.scss'

export const ShareAssistantModal = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.share_assistant',
  })
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
  const shareText = t('content_to_share')

  const handleCopyBtnClick = () => {
    navigator.clipboard.writeText(url)

    toast.custom(t => (t.visible ? <ToastCopySucces /> : null), {
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
      <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={s.shareModal}>
          <div className={s.header}>{t('header')}</div>
          <div className={s.main}>
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
          <p className={cx('text', 'lines')}>{t('separator_text')}</p>
          <div className={s.bottom}>
            <div className={s.footer}>
              <Input
                name='link'
                control={control}
                big
                props={{ readOnly: true }}
              />
              <Button props={{ onClick: handleCopyBtnClick }} theme='primary'>
                {t('btns.copy')}
              </Button>
            </div>
            <a href={url} target='_blank' rel='noopener noreferrer'>
              <Button theme='secondary' long>
                {t('btns.open_link')}
              </Button>
            </a>
          </div>
        </div>
      </BaseModal>
    </>
  )
}
