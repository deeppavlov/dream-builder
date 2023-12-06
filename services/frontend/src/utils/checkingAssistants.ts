import { franc, francAll } from 'https://esm.sh/franc@6'
import i18n from 'i18n'
import LanguageDetect from 'languagedetect'
import { UseQueryResult } from 'react-query'
import { ICollectionError, ISkill, TComponents } from 'types/types'

const arrInitPromptBlock2 = [
  { 'Act as [YOUR INPUT].': /[Aa]ct as (?:\b\w+\b|\[.*?\]|[А-я_]+)/gm },
  {
    'YOUR PERSONALITY: \nYour name is [YOUR INPUT]. Your interests are: [YOUR INPUT].':
      /YOUR PERSONALITY: [Yy]our name is (?:\b\w+\b|\[.*?\]|[А-я_]+). [Yy]our interests are: (?:\b\w+\b|\[.*?\]|[А-я_]+)/gm,
  },
  {
    'TASK: \nour task is to do [YOUR INPUT].':
      /TASK: our task is to do (?:\b\w+\b|\[.*?\]|[А-я_]+)/gm,
  },
  {
    'Use [YOUR INPUT] voice and tone.':
      /[Uu]se (?:\b\w+\b|\[.*?\]|[А-я_]+) voice and tone/gm,
  },
  {
    'Reply in [YOUR INPUT] language.':
      /[Rr]eply in (?:\b\w+\b|\[.*?\]|[А-я_]+) language/gm,
  },
  {
    'The target audience is [YOUR INPUT].':
      /[Tt]he target audience is (?:\b\w+\b|\[.*?\]|[А-я_]+)./gm,
  },
  {
    'I want you to reply in [YOUR INPUT] format.':
      /[Ii] want you to reply in (?:\b\w+\b|\[.*?\]|[А-я_]+) format/gm,
  },
  {
    'Limit your replies to [YOUR INPUT] words.':
      /[Ll]imit your replies to (?:\b\w+\b|\[.*?\]|[А-я_]+) words./gm,
  },
  {
    'Your ultimate goal is to persuade human to do [YOUR INPUT].':
      /[Yy]our ultimate goal is to persuade human to do (?:\b\w+\b|\[.*?\]|[А-я_]+)/gm,
  },
  {
    'CONTEXT ABOUT HUMAN: \n"""[YOUR INPUT]""".':
      /CONTEXT ABOUT HUMAN: """(?:\b\w+\b|\[.*?\]|[А-я_]+)"""/gm,
  },
  {
    'INSTRUCTION: \n"""[YOUR INPUT]""".':
      /INSTRUCTION: """(?:\b\w+\b|\[.*?\]|[А-я_]+)"""/gm,
  },
  {
    'EXAMPLE:\n"""[YOUR INPUT]""".':
      /EXAMPLE:"""(?:\b\w+\b|\[.*?\]|[А-я_]+)"""/gm,
  },
  {
    "Don't reply to following topics: [YOUR INPUT].":
      /[Dd]on't reply to following topics: (?:\b\w+\b|\[.*?\]|[А-я_]+)/gm,
  },
  {
    'Reply to human from [YOUR INPUT] point of view.':
      /[Rr]eply to human from (?:\b\w+\b|\[.*?\]|[А-я_]+) point of view/gm,
  },
  {
    'Я хочу, чтобы вы выступили в роли [ВАШ ВВОД].':
      /[Яя] хочу, чтобы вы выступили в роли (?:\b\w+\b|\[.*?\]|[А-я_]+)/gm,
  },
  {
    'ВАША ЛИЧНОСТЬ: Ваше имя: [ВАШ ВВОД]. Ваши интересы: [ВАШ ВВОД].':
      /ВАША ЛИЧНОСТЬ: Ваше имя: (?:\b\w+\b|\[.*?\]|[А-я_]+). Ваши интересы: (?:\b\w+\b|\[.*?\]|[А-я_]+)/gm,
  },
]

const InputPrompt = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  const arrInputs = ['[YOUR INPUT]', '[ВАШ ВВОД]']
  const str = arrInputs.reduce(
    (acc, str) => (skill.prompt?.includes(str) ? (acc += ' ' + str) : acc),
    ''
  )

  if (str.length !== 0) {
    const newError = {
      status: 'error',
      massage: `${i18n.t('error_massage.prompt.input')} ${str}`,
    }
    acc.error = [...acc.error, newError]
  }
}

const lengthPrompt = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined || skill.prompt === null) {
    return
  }

  if (skill.prompt.length < 3) {
    const newWarning = {
      status: 'warning',
      massage: i18n.t('error_massage.prompt.length'),
    }
    acc.warning = [...acc.warning, newWarning]
  }
}

const typePrompt = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined || skill.prompt === null) {
    return
  }

  const arr = ['+', '-', '=', '*', '/', '%', '(', ')']

  const result = skill.prompt.replace(/(?:\b[a-zA-Z]+\b|\[.*?\]|[А-я_]+)/gi, '')

  const str = skill.prompt.match(/(?:\b[a-zA-Z]+\b|\[.*?\]|[А-я_]+)/gi)

  const arrIsIncludes = arr.map(el => result.includes(el))

  if (arrIsIncludes.includes(true) && str === null) {
    const newWarning = {
      status: 'warning',
      massage:
        'Возможно вы используете арифметические выражение в своей инструкции',
    }
    acc.warning = [...acc.warning, newWarning]
    return
  }
}

const languagePrompt = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  const languageArrSkill: string[] | undefined =
    skill.lm_service?.languages?.map(el => el.value)

  const result = franc(skill.prompt, {
    minLength: 3,
    only: ['rus', 'eng'],
  }).slice(0, 2)

  if (result === 'un') {
    const newError = {
      status: 'error',
      massage: `мы не смогли определить язык вашего промта`,
    }
    acc.error = [...acc.error, newError]
    return
  }

  if (languageArrSkill?.includes(result)) {
    return
  }

  const newWarning = {
    status: 'error',
    massage: `${i18n.t('error_massage.prompt.language')} ${result}`,
  }
  acc.warning = [...acc.warning, newWarning]
}

const promptBlocks = (skill: ISkill, acc: ICollectionError) => {
  const promtText =
    skill.prompt === undefined ? '' : skill.prompt.replace(/\s+/g, ' ').trim()

  const promptBlocks = skill.lm_service?.prompt_blocks?.map(el => el.template)

  const invalidBlocks = arrInitPromptBlock2.filter(
    el => !promptBlocks?.includes(Object.keys(el)[0])
  )

  console.log()

  const arrIsinvalidBlocks = invalidBlocks?.reduce((acc: string[], el: any) => {
    const key = Object.keys(el)[0]
    const reg = el[key]

    const arrString = promtText.match(reg)

    if (arrString === null) {
      return acc
    }

    return [...acc, ...arrString]
  }, [])

  if (arrIsinvalidBlocks.length !== 0) {
    const newWarning = {
      status: 'warning',
      massage: `Возожно вы используете блок который не поддерживает этот скилл \n${arrIsinvalidBlocks.join(
        ',\n '
      )}`,
    }
    acc.warning = [...acc.warning, newWarning]
  }
}

export const examination = (data: ISkill) => {
  const acc = {
    error: [],
    warning: [],
  }

  InputPrompt(data, acc)
  lengthPrompt(data, acc)
  languagePrompt(data, acc)
  promptBlocks(data, acc)
  typePrompt(data, acc)
  return acc
}

export const examinationMassage = (
  component: UseQueryResult<TComponents, unknown>
) => {
  const isError = component.data?.skills
    ?.filter((el: ISkill) => el.name !== 'dummy_skill')
    .map((el: ISkill) => {
      const resultExamination = examination(el)
      return resultExamination?.error.length !== 0 ? true : false
    })
    .includes(true)

  const isWarning = component.data?.skills
    ?.filter((el: ISkill) => el.name !== 'dummy_skill')
    .map((el: ISkill) => {
      const resultExamination = examination(el)
      return resultExamination?.warning.length !== 0 ? true : false
    })
    .includes(true)

  const status: 'error' | 'warning' | 'success' = isError
    ? 'error'
    : isWarning
    ? 'warning'
    : 'success'

  const massageMap = {
    error: i18n.t('error_massage.error'),
    warning: i18n.t('error_massage.warning'),
    success: 'success',
  }

  const massage = massageMap[status]
  return { status, massage, isError }
}
