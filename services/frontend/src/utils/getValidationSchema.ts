import { useTranslation } from 'react-i18next'

export const getValidationSchema = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'field_validation' })

  return {
    globals: {
      required: t('required'),
      regExpPattern: {
        value: /^[\s\p{L}.'’,!-?«»]+$/giu,
        message: t('invalid'),
      },
      desc: {
        maxLength: (max: number) => ({
          value: max,
          message: t('desc_max', { max }),
        }),
      },
    },

    skill: {
      prompt: {
        maxLength: (max: number) => ({
          value: max,
          message: t('prompt_max', { max }),
        }),
      },
    },
  }
}
