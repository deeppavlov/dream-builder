import { RegisterOptions, useForm } from 'react-hook-form'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import s from './EditablePlaceholder.module.scss'

interface IProps {
  label: string
  value: string
  rules?: RegisterOptions
  handleSave?: (value: string) => void
  buttons?: React.ReactNode
  children?: React.ReactNode
}

export const EditablePlaceholder = ({
  label,
  value,
  rules,
  buttons,
  handleSave,
}: IProps) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm({ mode: 'all' })

  const onFormSubmit = (data: any) => handleSave && handleSave(data?.[label])

  return (
    <form
      className={s.editablePlaceholder}
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <TextArea
        label={label}
        name={label}
        control={control}
        withCounter
        defaultValue={value}
        resizable={false}
        theme='placeholder'
        rules={rules}
      />
      <div className={s.btns}>
        {buttons}
        {isDirty && (
          <Button theme='primary' small>
            Save
          </Button>
        )}
      </div>
    </form>
  )
}
