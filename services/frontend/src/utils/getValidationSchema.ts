import i18n from 'i18n'

export const getValidationSchema = () => {
  return {
    globals: {
      required: i18n.t('field_validation.required'),
      regExpPattern: {
        value: /^[\s\p{L}.'’,!-?«»]+$/giu,
        message: i18n.t('field_validation.invalid'),
      },
      emailPattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: i18n.t('field_validation.email'),
      },
      desc: {
        maxLength: (max: number) => ({
          value: max,
          message: i18n.t('field_validation.desc_max', { max }),
        }),
      },
    },

    skill: {
      prompt: {
        maxLength: (max: number) => ({
          value: max,
          message: i18n.t('field_validation.prompt_max', { max }),
        }),
      },
    },
  }
}
