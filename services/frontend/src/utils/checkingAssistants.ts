import { franc, francAll } from 'https://esm.sh/franc@6';
import i18n from 'i18n';
import LanguageDetect from 'languagedetect';
import { UseQueryResult } from 'react-query';
import { ICollectionError, ISkill, TComponents } from 'types/types';


//(?:\b\w+\b|\[.*?\]|[А-я_]+)
const arrInitPromptBlock = [
  'Act as [YOUR INPUT].',
  'YOUR PERSONALITY: \nYour name is [YOUR INPUT]. Your interests are: [YOUR INPUT].',
  'TASK: \nour task is to do [YOUR INPUT].',
  'Use [YOUR INPUT] voice and tone.',
  'Reply in [YOUR INPUT] language.',
  'The target audience is [YOUR INPUT].',
  'I want you to reply in [YOUR INPUT] format.',
  'Limit your replies to [YOUR INPUT] words.',
  'Your ultimate goal is to persuade human to do [YOUR INPUT].',
  'CONTEXT ABOUT HUMAN: \n"""[YOUR INPUT]""".',
  'INSTRUCTION: \n"""[YOUR INPUT]""".',
  'EXAMPLE:\n"""[YOUR INPUT]""".',
  "Don't reply to following topics: [YOUR INPUT].",
  'Reply to human from [YOUR INPUT] point of view.',
  'Я хочу, чтобы вы выступили в роли [ВАШ ВВОД].',
  'ВАША ЛИЧНОСТЬ: Ваше имя: [ВАШ ВВОД]. Ваши интересы: [ВАШ ВВОД].',
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

  // console.log(str)

  if (true) {
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

  const result = skill.prompt.length < 1
  if (result) {
    const newWarning = {
      status: 'error',
      massage: i18n.t('error_massage.prompt.length'),
    }
    acc.warning = [...acc.warning, newWarning]
  }
}

const languagePrompt = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  const languageArrSkill: string[] | undefined =
    skill.lm_service?.languages?.map(el => el.value)



 const r = franc(skill.prompt, {only: ['rus', 'eng']})

 console.log(r)

  if (!languageArrSkill) {
    return
  }

  const promptLanguage = 'заглушка'

  if (true) {
    const newWarning = {
      status: 'error',
      massage: `${i18n.t('error_massage.prompt.language')} ${promptLanguage}`,
    }
    acc.warning = [...acc.warning, newWarning]
  }
}

const promptBlocks = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  if (skill.lm_service?.prompt_blocks?.length === 0) {
    return
  }

  let accString = ''

  const promptBlocks = skill.lm_service?.prompt_blocks?.map(el => el.template)

  const invalidBlocks = arrInitPromptBlock.filter(
    el => !promptBlocks?.includes(el)
  )

  const arrIsinvalidBlocks = invalidBlocks?.map(el => {
    const regString = '(?:\\b\\w+\\b|\\[.*?\\]|[А-я_]+)'

    const strReg = el
      .replaceAll('[YOUR INPUT]', regString)
      .replaceAll('[ВАШ ВВОД]', regString)

    const reg = new RegExp(strReg, 'g')

    const result = reg.test(skill.prompt)

    if (result) {
      accString += el
    }

    return result
  })

  if (arrIsinvalidBlocks.includes(true)) {
    const newWarning = {
      status: 'warning',
      massage: `Возожно вы используете блок который не поддерживает этот скилл ${accString}`,
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