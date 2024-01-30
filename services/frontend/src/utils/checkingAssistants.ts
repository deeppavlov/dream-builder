import { franc } from 'franc'
import i18n from 'i18n'
import { UseQueryResult } from 'react-query'
import {
  ICollectionError,
  ISkill,
  LanguageModel,
  TComponents,
} from 'types/types'
import getTokensLength from 'utils/getTokensLength'

const arrInitPromptBlock = [
  { 'Act as [YOUR INPUT].': /[Aa]ct as (?:\b\w+\b|\[.*?\]|[А-я_]+)/gm },
  {
    'YOUR PERSONALITY: \nYour name is [YOUR INPUT]. Your interests are: [YOUR INPUT].':
      /YOUR PERSONALITY: [Yy]our name is (?:\b\w+\b|\[.*?\]|[А-я_]+).? [Yy]our interests are: (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'TASK: \nYour task is to do [YOUR INPUT].':
      /TASK: [Yy]our task is to do (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'Use [YOUR INPUT] voice and tone.':
      /[Uu]se (?:\b\w+\b|\[.*?\]|[А-я_]+) voice and tone.?/gm,
  },
  {
    'Reply in [YOUR INPUT] language.':
      /[Rr]eply in (?:\b\w+\b|\[.*?\]|[А-я_]+) language.?/gm,
  },
  {
    'The target audience is [YOUR INPUT].':
      /[Tt]he target audience is (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'I want you to reply in [YOUR INPUT] format.':
      /[Ii] want you to reply in (?:\b\w+\b|\[.*?\]|[А-я_]+) format.?/gm,
  },
  {
    'Limit your replies to [YOUR INPUT] words.':
      /[Ll]imit your replies to (?:\b\w+\b|\[.*?\]|[А-я_]+) words.?/gm,
  },
  {
    'Your ultimate goal is to persuade human to do [YOUR INPUT].':
      /[Yy]our ultimate goal is to persuade human to do (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'CONTEXT ABOUT HUMAN: \n"""[YOUR INPUT]""".':
      /CONTEXT ABOUT HUMAN: """(?:\b\w+\b|\[.*?\]|[А-я_]+)""".?/gm,
  },
  {
    'INSTRUCTION: \n"""[YOUR INPUT]""".':
      /INSTRUCTION: """(?:\b\w+\b|\[.*?\]|[А-я_]+)""".?/gm,
  },
  {
    'EXAMPLE:\n"""[YOUR INPUT]""".':
      /EXAMPLE:"""(?:\b\w+\b|\[.*?\]|[А-я_]+)""".?/gm,
  },
  {
    "Don't reply to following topics: [YOUR INPUT].":
      /[Dd]on't reply to following topics: (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'Reply to human from [YOUR INPUT] point of view.':
      /[Rr]eply to human from (?:\b\w+\b|\[.*?\]|[А-я_]+) point of view.?/gm,
  },
  {
    'Я хочу, чтобы вы выступили в роли [ВАШ ВВОД].':
      /[Яя] хочу, чтобы вы выступили в роли (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'ВАША ЛИЧНОСТЬ: Ваше имя: [ВАШ ВВОД]. Ваши интересы: [ВАШ ВВОД].':
      /ВАША ЛИЧНОСТЬ: [Вв]аше имя: (?:\b\w+\b|\[.*?\]|[А-я_]+). Ваши интересы: (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },

  {
    'Отвечай на [ВВЕДИТЕ ДАННЫЕ] языке.':
      /[Оо]твечай на (?:\b\w+\b|\[.*?\]|[А-я_]+).? языке.?/gm,
  },

  {
    'Формат ответа: [ВВЕДИТЕ ДАННЫЕ].':
      /[Фф]ормат ответа: (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'Действуй как [ВВЕДИТЕ ДАННЫЕ].':
      /[Дд]ействуй как (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },

  {
    'ЛИЧНОСТЬ: Твое имя: [ВВЕДИТЕ ДАННЫЕ]. Твои интересы: [ВВЕДИТЕ ДАННЫЕ].':
      /ЛИЧНОСТЬ: [Тт]вое имя: (?:\b\w+\b|\[.*?\]|[А-я_]+).? [Тт]вои интересы: (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'Представь, что [ВВЕДИТЕ ДАННЫЕ].':
      /[Пп]редставь, что (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'ЗАДАЧА: Твоя задача - [ВВЕДИТЕ ДАННЫЕ].':
      /ЗАДАЧА: [Тт]воя задача - (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'Целевая аудитория: [ВВЕДИТЕ ДАННЫЕ].':
      /[Цц]елевая аудитория: (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    // уточнить
    'Инструкция:1. [ВВЕДИТЕ ДАННЫЕ].2. [ВВЕДИТЕ ДАННЫЕ].…':
      /[Ии]нструкция:1. (?:\b\w+\b|\[.*?\]|[А-я_]+).?.2. (?:\b\w+\b|\[.*?\]|[А-я_]+).?.…/gm,
  },
  {
    'ТВОЯ КОНЕЧНАЯ ЦЕЛЬ: [ВВЕДИТЕ ДАННЫЕ].':
      /ТВОЯ КОНЕЧНАЯ ЦЕЛЬ: (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'Стиль ответа: [ВВЕДИТЕ ДАННЫЕ].':
      /[Сc]тиль ответа: (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
  {
    'Недопустимы следующие темы: [ВВЕДИТЕ ДАННЫЕ].':
      /[Нн]едопустимы следующие темы: (?:\b\w+\b|\[.*?\]|[А-я_]+).?/gm,
  },
]

const InputPrompt = (skill: ISkill, acc: ICollectionError) => {
  if (!skill.prompt) {
    return
  }

  const arrInputs = ['[YOUR INPUT]', '[ВАШ ВВОД]']
  const str = arrInputs.reduce(
    (acc, str) => (skill.prompt?.includes(str) ? (acc += ' ' + str) : acc),
    ''
  )

  if (str.length !== 0) {
    const mas = `${i18n.t('error_message.prompt.input')} ${str}`
    acc.errors = [...acc.errors, mas]
  }
}

const lengthMinPrompt = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined || skill.prompt === null) {
    return
  }

  if (skill.prompt.length < 3) {
    const message = i18n.t('error_message.prompt.lengthMin')
    acc.warnings = [...acc.warnings, message]
  }
}

const typePrompt = (skill: ISkill, acc: ICollectionError) => {
  if (!skill.prompt) {
    return
  }

  const arr = ['+', '-', '=', '*', '/', '%', '(', ')']

  const result = skill.prompt.replace(/(?:\b[a-zA-Z]+\b|\[.*?\]|[А-я_]+)/gi, '')

  const str = skill.prompt.match(/(?:\b[a-zA-Z]+\b|\[.*?\]|[А-я_]+)/gi)

  const arrIsIncludes = arr.map(el => result.includes(el))

  if (arrIsIncludes.includes(true) && str === null) {
    const message = i18n.t('error_message.prompt.type')
    acc.warnings = [...acc.warnings, message]
    return
  }
}

const languagePrompt = (skill: ISkill, acc: ICollectionError) => {
  if (!skill.prompt) {
    return
  }

  const languageArrSkill: string[] | undefined =
    skill.lm_service?.languages?.map(el => el.value)

  const result = franc(skill.prompt, {
    minLength: 3,
    only: ['rus', 'eng'],
  }).slice(0, 2)

  if (result === 'un') {
    const message = i18n.t('error_message.prompt.languageUndefined')
    acc.errors = [...acc.errors, message]
    return
  }

  if (languageArrSkill?.includes(result)) {
    return
  }
  const message = `${i18n.t('error_message.prompt.language')} ${result}`

  acc.warnings = [...acc.warnings, message]
}

const promptBlocks = (skill: ISkill, acc: ICollectionError) => {
  const promptText = !skill.prompt
    ? ''
    : skill.prompt.replace(/\s+/g, ' ').trim()

  const promptBlocks = skill.lm_service?.prompt_blocks?.map(el => el.template)

  const invalidBlocks = arrInitPromptBlock.filter(
    el => !promptBlocks?.includes(Object.keys(el)[0])
  )

  const arrIsinvalidBlocks = invalidBlocks?.reduce((acc: string[], el: any) => {
    const key = Object.keys(el)[0]
    const reg = el[key]

    const arrString = promptText?.match(reg)

    if (!arrString) {
      return acc
    }

    return [...acc, ...arrString]
  }, [])

  if (arrIsinvalidBlocks.length !== 0) {
    const message = `${i18n.t(
      'error_message.prompt.blocks'
    )} \n● ${arrIsinvalidBlocks.join(',\n ● ')}`

    acc.warnings = [...acc.warnings, message]
  }
}

const lengthMaxPrompt = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined || skill.prompt === null) {
    return
  }

  const lmServiceName = skill?.lm_service?.name as LanguageModel

  const maxToken: number = skill.lm_service?.max_tokens ?? 0

  if (skill.prompt.length < maxToken) {
    return
  }
  const curentCountToken = getTokensLength(lmServiceName, skill.prompt)
  const isСrowded = maxToken < curentCountToken

  if (isСrowded) {
    const message = `${i18n.t(
      'error_message.prompt.lengthMax'
    )} ${curentCountToken}/${maxToken}`
    acc.errors = [...acc.errors, message]
  }
}

export const examination = (data: ISkill) => {
  const acc = {
    errors: [],
    warnings: [],
  }

  InputPrompt(data, acc)
  lengthMinPrompt(data, acc)
  lengthMaxPrompt(data, acc)
  languagePrompt(data, acc)
  promptBlocks(data, acc)
  typePrompt(data, acc)
  return acc
}

export const examinationMessage = (
  component: UseQueryResult<TComponents, unknown>
) => {
  const isError = component.data?.skills
    ?.filter((el: ISkill) => el.name !== 'dummy_skill')
    .map((el: ISkill) => {
      const resultExamination = examination(el)
      return resultExamination?.errors.length !== 0 ? true : false
    })
    .includes(true)

  const isWarning = component.data?.skills
    ?.filter((el: ISkill) => el.name !== 'dummy_skill')
    .map((el: ISkill) => {
      const resultExamination = examination(el)
      return resultExamination?.warnings.length !== 0 ? true : false
    })
    .includes(true)

  const status: 'error' | 'warning' | 'success' = isError
    ? 'error'
    : isWarning
    ? 'warning'
    : 'success'

  const messageMap = {
    error: i18n.t('error_message.error'),
    warning: i18n.t('error_message.warning'),
    success: 'success',
  }

  const message = messageMap[status]
  return { status, message, isError }
}
