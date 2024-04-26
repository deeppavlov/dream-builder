import classNames from 'classnames/bind'
import { useAuth } from 'context'
import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { ReactComponent as FeedBack } from 'assets/icons/feedBack.svg'
import { ReactComponent as FileUpload } from 'assets/icons/fileUpload.svg'
import { IFeedback } from 'types/types'
import { TOOLTIP_DELAY } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { sendFeedBack } from 'api/components/index'
import { getValidationSchema } from 'utils/getValidationSchema'
import { Button } from 'components/Buttons'
import { Input, TextArea } from 'components/Inputs'
import { BaseToolTip } from 'components/Menus'
import BaseModal from '../BaseModal/BaseModal'
import s from './Feedback.module.scss'

export const Feedback: FC = () => {
  const { user } = useAuth()

  const localStorageKey = `feedBack_user_${user?.id ?? 'default'}`

  let cx = classNames.bind(s)

  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.feedback',
  })

  const dataLocalStorage = JSON.parse(
    localStorage.getItem(localStorageKey) || '{}'
  )

  const defaultValues: IFeedback = {
    text: dataLocalStorage.text ?? '',
    pictures: [],
    email: dataLocalStorage.email ?? user?.email ?? '',
  }

  const { handleSubmit, setValue, control, getValues, watch, clearErrors } =
    useForm({
      defaultValues: defaultValues,
    })

  const schema = getValidationSchema()
  const [fileList, setFileList] = useState<string[]>([])

  const fileInput = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    setValue('pictures', fileList)
  }, [fileList])

  useEffect(() => {
    const newDate = { text: getValues().text, email: getValues().email }
    localStorage.setItem(localStorageKey, JSON.stringify(newDate))
  }, [watch('text'), watch('email')])

  const handleAddFile = (event: any) => {
    const file = event.target.files
    const keys = Object.keys(file)

    const getLimitKey = () => {
      const lengthFileList = fileList.length
      const lengthKeys = keys.length

      const isOverFlow = lengthFileList + lengthKeys >= 15

      if (isOverFlow) {
        const difference = lengthFileList + lengthKeys - 15
        return keys.slice(0, keys.length - difference)
      }
      return keys
    }

    getLimitKey().forEach(key => {
      const FReader = new FileReader()
      FReader.onload = (e: any) => {
        const src = e.target.result
        const img = new Image()

        img.onload = () => {
          setFileList(prev => [...prev, src])
        }
        img.src = e.target.result
      }
      FReader.readAsDataURL(file[key])
    })
  }

  const onSubmit = (data: IFeedback) => {
    toast
      .promise(sendFeedBack(data), toasts().sendFeedBack)
      .then(() => clearingForm())
      .then(() => setIsOpen(false))
  }

  const renderFiles = () =>
    !!fileList.length && (
      <div className={s.listFile}>
        {fileList.map((el, indexFile) => {
          return (
            <div className={s.file} key={indexFile}>
              <img src={el} alt='' />
              <CloseIcon
                className={s.close}
                onClick={() => {
                  const newFileList = fileList.filter(
                    (_, indexNewFile: number) => indexNewFile !== indexFile
                  )
                  setFileList(newFileList)
                }}
              />
            </div>
          )
        })}
      </div>
    )

  const clearingForm = () => {
    setValue('text', '')
    setValue('pictures', [])
    if (user !== null) setValue('email', user?.email)
    setFileList([])
    clearErrors()
  }

  const emailForm = () => {
    return (
      <div className={s.emailInput}>
        <Input
          name='email'
          label={'Email'}
          control={control}
          props={{ placeholder: '', style: { width: 'none' } }}
          rules={{
            required: schema.globals.required,
            pattern: schema.globals.emailPattern,
          }}
        />
      </div>
    )
  }

  const addImgIcon = () =>
    fileList.length < 15 && (
      <button
        className={s.addFileBtn}
        type='button'
        onClick={() => {
          fileInput.current && fileInput.current.click()
        }}
      >
        <FileUpload className={s.fileUploadIcon} />
      </button>
    )

  return (
    <>
      <button
        id='FeedBack'
        data-tooltip-id='FeedBack'
        onClick={() => setIsOpen(!isOpen)}
        className={cx('icon', isOpen && 'active')}
      >
        <FeedBack className={s.feedBackIcon} />
        <BaseToolTip
          id='FeedBack'
          content={'Feedback'}
          delayShow={TOOLTIP_DELAY}
          place='right'
        />
      </button>
      <BaseModal
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        modalClassName={s.modalFeedback}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <div>
            <mark>{t('description')}</mark>
          </div>
          {emailForm()}
          <div className={s.text}>
            <TextArea
              name={'text'}
              control={control}
              withCounter
              rules={{
                required: schema.globals.required,
                maxLength: schema.globals.desc.maxLength(1000),
                pattern: schema.globals.regExpPattern,
              }}
              props={{
                placeholder: t('placeholder'),
                rows: 6,
              }}
            />
          </div>

          {renderFiles()}

          <div className={s.btns}>
            {addImgIcon()}
            <input
              type='file'
              accept='.jpg, .jpeg, .png'
              multiple
              onChange={e => handleAddFile(e)}
              ref={fileInput}
              hidden={true}
            />

            <Button theme='secondary' props={{ onClick: () => clearingForm() }}>
              {t('btns.сlean')}
            </Button>
            <Button
              theme='primary'
              props={{
                type: 'submit',
              }}
            >
              {t('btns.send')}
            </Button>
          </div>
        </form>
      </BaseModal>
    </>
  )
}
