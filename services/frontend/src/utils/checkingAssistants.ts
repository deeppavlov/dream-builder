import { UseQueryResult } from 'react-query'
import { ICollectionError, ISkill, TComponents } from 'types/types'

const InputError = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  const regex = /\[YOUR INPUT]/g
  const result = regex.test(skill.prompt)
  if (result) {
    const newError = {
      status: 'error',
      massage: 'Не допустимое значение [YOUR INPUT]',
    }
    acc.error = [...acc.error, newError]
  }
}

const languageWarning = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  const regex = /[A-z]/g
  const result = regex.test(skill.prompt)
  if (result) {
    const newWarning = {
      status: 'warning',
      massage: 'Нет поддержки en',
    }
    acc.warning = [...acc.warning, newWarning]
  }
}

const lengthPrompt = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined || skill.prompt === null) {
    return
  }

  const result = skill.prompt.length < 5
  if (result) {
    const newWarning = {
      status: 'warning',
      massage: 'длинна промта всего 5 символов',
    }
    acc.warning = [...acc.warning, newWarning]
  }
}

const test1 = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  const result = true
  if (result) {
    const newError = {
      status: 'error',
      massage: 'тестовая ошибка 1',
    }
    acc.error = [...acc.error, newError]
  }
}

const test2 = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  const result = true
  if (result) {
    const newError = {
      status: 'error',
      massage: 'тестовая ошибка 2',
    }
    acc.error = [...acc.error, newError]
  }
}

const test3 = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  const result = true
  if (result) {
    const newWarning = {
      status: 'warning',
      massage: 'тестовая ошибка 3',
    }
    acc.warning = [...acc.warning, newWarning]
  }
}

const test4 = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  const result = true
  if (result) {
    const newError = {
      status: 'error',
      massage:
        'Очень длинная критическая ошибка которая описывает ошибку скила и как ее исправить что бы было правильно.',
    }
    acc.error = [...acc.error, newError]
  }
}

const test5 = (skill: ISkill, acc: ICollectionError) => {
  if (skill.prompt === undefined) {
    return
  }

  const result = true
  if (result) {
    const newWarning = {
      status: 'warning',
      massage:
        'Очень длинное предупреждение о том что ваш скилл может работать не корректно, и то как это можно поправить. ',
    }
    acc.warning = [...acc.warning, newWarning]
  }
}

export const examination = (data: ISkill) => {
  const acc = {
    error: [],
    warning: [],
  }

  InputError(data, acc)
  languageWarning(data, acc)
  lengthPrompt(data, acc)
  test1(data, acc)
  test2(data, acc)
  test3(data, acc)
  test4(data, acc)
  test5(data, acc)
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
    error:
      'Вы не можете собрать ассистента с критическими ошибками, пожалуйста, исправите их.',
    warning:
      'У вас есть рекомендации, возможно ваш ассистент будет работать не так как вы хотите.',
    success: 'success',
  }

  const massage = massageMap[status]
  return { status, massage, isError }
}
