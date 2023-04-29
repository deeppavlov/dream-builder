export const validationSchema = {
  global: {
    required: 'This field can’t be empty',
    regExpPattern: {
      value: /^[\s\p{L}.'’,!-?]+$/giu,
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
