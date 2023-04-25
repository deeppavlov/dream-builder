export const validationSchema = {
  global: {
    required: 'This field can’t be empty',
    engSpeechRegExp: {
      value: /^[a-zA-Z0-9\s\p{P}.'’,!-?]+$/gi,
      message: 'Invalid data',
    },
    desc: {
      maxLength: (max: number) => ({
        value: max,
        message: `Limit text description to ${max} characters`,
      }),
    },
  },

  skill: {
    prompt: {
      maxLength: (max: number) => ({
        value: max,
        message: `Limit prompt to ${max} tokens`,
      }),
    },
  },
}
