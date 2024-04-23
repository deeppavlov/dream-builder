import classNames from 'classnames/bind'
import { useAuth } from 'context'
import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { ReactComponent as FeedBack } from 'assets/icons/feedBack.svg'
import { ReactComponent as FileUpload } from 'assets/icons/fileUpload.svg'
import { TOOLTIP_DELAY } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { sendFeedBack } from 'api/components/index'
import { getValidationSchema } from 'utils/getValidationSchema'
import { Button } from 'components/Buttons'
import { Input, TextArea } from 'components/Inputs'
import { BaseToolTip } from 'components/Menus'
import BaseModal from '../BaseModal/BaseModal'
import s from './Feedback.module.scss'

interface feedback {
  text: string
  pictures: string[]
  email: string | undefined
}

interface elFileLists {
  id: number
  src: string
}

const generatorId = () => {
  const acc: number[] = [0]
  return () => {
    const newNumber = acc.at(-1)
    acc.push((newNumber ?? 0) + 1)
    const id = acc.at(-1)
    return id
  }
}

const getId = generatorId()

export const Feedback: FC = () => {
  const { user } = useAuth()

  let cx = classNames.bind(s)

  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.feedback',
  })

  const localStorageText = localStorage.getItem('text')
  const localStoragePictures =
    localStorage.getItem('pictures') === null
      ? []
      : JSON.parse(localStorage.getItem('pictures') || '')

  const defaultValues: feedback = {
    text: localStorageText ?? '',
    pictures: localStoragePictures,
    email: '',
  }

  const { handleSubmit, setValue, control, getValues } = useForm({
    defaultValues: defaultValues,
  })

  const schema = getValidationSchema()
  const [fileList, setFileList] = useState<elFileLists[]>([
    ...localStoragePictures,
  ])

  const fileInput = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    const picturesList = fileList.map(({ src }) => src)
    setValue('pictures', picturesList)
    localStorage.setItem('pictures', JSON.stringify(fileList))
  }, [fileList])

  useEffect(() => {
    localStorage.setItem('text', getValues('text'))
    localStorage.setItem('email', getValues('email') || '')
  }, [getValues().text, getValues().email])

  useEffect(() => {
    if (user === null) {
      localStorage.setItem('email', '')
    }
  }, [user])

  useEffect(() => {
    const localStorageEmail =
      localStorage.getItem('email') === ''
        ? user?.email === null
          ? ''
          : user?.email
        : localStorage.getItem('email') ?? ''
    setValue('email', localStorageEmail)
  }, [])

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

        const id = getId() ?? 0
        const el = { id: id, src }

        img.onload = () => {
          setFileList(prev => [...prev, el])
        }
        img.src = e.target.result
      }
      FReader.readAsDataURL(file[key])
    })
  }

  const onSubmit = (data: feedback) => {
    toast
      .promise(sendFeedBack(data), toasts().sendFeedBack)
      .then(() => clearingForm())
      .then(() => setIsOpen(false))
  }

  const renderFile = () => {
    return fileList.map((el: elFileLists, index: number) => {
      return (
        <div className={s.file} key={index}>
          <img
            src={el.src}
            alt=''
            onClick={() => {
              const newFileList = fileList.filter(
                (newEl: elFileLists) => newEl.id !== el.id
              )
              setFileList(newFileList)
            }}
          />
          <CloseIcon
            className={s.close}
            onClick={() => {
              const newFileList = fileList.filter(
                (newEl: elFileLists) => newEl.id !== el.id
              )
              setFileList(newFileList)
            }}
          />
        </div>
      )
    })
  }

  const clearingForm = () => {
    setValue('text', '')
    setValue('pictures', [])
    user?.email === undefined
      ? setValue('email', '')
      : setValue('email', user.email)
    setFileList([])
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

  const addImgIcon = () => {
    if (fileList.length >= 15) {
      return null
    }
    return (
      <div>
        <FileUpload
          className={s.FileUpload}
          onClick={() => {
            if (fileInput.current) {
              fileInput.current.click()
            }
          }}
        ></FileUpload>
      </div>
    )
  }

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
        modalClassName='modalFeedback'
        id='modalFeedback'
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

          <div className={s.listFile}>
            {renderFile()}
            {addImgIcon()}
          </div>
          <div className={s.btns}>
            <input
              type='file'
              accept='.jpg, .jpeg, .png'
              multiple
              onChange={e => handleAddFile(e)}
              ref={fileInput}
              hidden={true}
            />

            <Button theme='primary' props={{ onClick: () => clearingForm() }}>
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
