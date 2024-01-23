import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/Buttons'
import BaseModal from '../BaseModal/BaseModal'
import s from './Feedback.module.scss'

export const Feedback: FC = () => {
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      description: '',
      fileList: [],
    },
  })

  const [fileList, setFileList] = useState<any>([])

  useEffect(() => {
    setValue('fileList', fileList)
  }, [fileList])

  const fileInput = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isOpenModalСhanges, setisOpenModalСhanges] = useState<boolean>(false)

  const { t } = useTranslation()

  const handleEventUpdate = () => setIsOpen(!isOpen)

  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click()
    }
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files
    const key = Object.keys(file)

    key.forEach(key => {
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

  const onSubmit = (data: any) => console.log(data)

  const renderFile = () => {
    return fileList.map((file: any, index: number) => {
      return (
        <div className={s.file} key={index}>
          <img src={file} alt='' style={{ width: 50, height: 50 }} />
        </div>
      )
    })
  }

  const resF = (value: boolean) => {
    const isEmpty = fileList.length !== 0 || getValues().description !== ''

    console.log(getValues())

    if (isEmpty) {
      setisOpenModalСhanges(true)
      return
    }

    setIsOpen(value)
  }

  const clearingForm = () => {
    setValue('description', '')
    setValue('fileList', [])
    setFileList([])
    setIsOpen(false)
    setisOpenModalСhanges(false)
  }

  return (
    <>
      <div onClick={handleEventUpdate}>123</div>
      <BaseModal isOpen={isOpen} setIsOpen={resF} closeOnBackdropClick={false}>
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <div className={s.description}>
            <label htmlFor='description'>
              Оставляя отзыв вы делаете нас лучше
            </label>
          </div>

          <div className={s.text}>
            <textarea
              {...register('description', {
                validate: {
                  pattern: (value: string) => !/[!]/.test(value),
                },
              })}
              placeholder='Опишите проблему с которой вы столкнулись'
            />
          </div>

          <div>
            <div className={s.listFile}>{renderFile()}</div>
            <input
              type='file'
              accept='.jpg, .jpeg, .png'
              multiple
              onChange={e => handleFileChange(e)}
              ref={fileInput}
              hidden={true}
            />
            <Button
              theme='primary'
              props={{
                onClick: () => handleClick(),
              }}
            >
              +
            </Button>
          </div>

          <Button
            theme='primary'
            props={{
              type: 'submit',
            }}
          >
            Отправить
          </Button>
        </form>
      </BaseModal>
      <BaseModal
        isOpen={isOpenModalСhanges}
        setIsOpen={setisOpenModalСhanges}
        closeOnBackdropClick={false}
      >
        <div className={s.savModal}>
          <div className={s.text}>у вас есть заполненная форма </div>
          <div className={s.buttons}>
            <Button
              theme='primary'
              props={{
                onClick: () => setisOpenModalСhanges(false),
              }}
            >
              продолжить
            </Button>
            <Button
              theme='primary'
              props={{
                onClick: () => clearingForm(),
              }}
            >
              отчистить
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  )
}
