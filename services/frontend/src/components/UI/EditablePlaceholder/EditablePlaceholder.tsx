import { RegisterOptions, useForm } from 'react-hook-form'
import { Button } from 'components/Buttons'
import { TextArea } from 'components/Inputs'
import s from './EditablePlaceholder.module.scss'

interface IProps {
  label: string
  value: string
  disabled?: boolean
  rules?: RegisterOptions
  buttons?: React.ReactNode
  children?: React.ReactNode
  handleSave?: (value: string) => void
}

export const EditablePlaceholder = ({
  label,
  value,
  disabled,
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
        props={{ disabled }}
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
