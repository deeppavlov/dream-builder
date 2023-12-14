import { ReactComponent as Error } from '@assets/icons/error_circle.svg'
import { ReactComponent as Warning } from '@assets/icons/warning_triangle.svg'
import { useUIOptions } from 'context'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import {
  BotInfoInterface,
  ICollectionError,
  ICustomAssistant,
  ICustomSkill,
  ISkill,
  IStackElement,
} from 'types/types'
import { VISIBILITY_STATUS } from 'constants/constants'
import { useAssistants, useComponent } from 'hooks/api'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import { examination } from 'utils/checkingAssistants'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import s from './WarningsInfo.module.scss'

const WarningsInfo = () => {
  const { fetchPrivateDists } = useAssistants()
  const { skillEditorOpened } = useGaSkills()
  const { getAllComponents } = useComponent()
  const navigate = useNavigate()
  const privateDists = fetchPrivateDists()
  const { t } = useTranslation('translation', {
    keyPrefix: 'sidepanels.warningsInfo',
  })
  const { setVaArchitectureOptions } = useGaAssistant()
  const nav = useNavigate()
  const { name } = useParams()
  const { setUIOption } = useUIOptions()

  const dispatchTrigger = (isOpen: boolean) =>
    setUIOption({
      name: consts.WARNING_WINDOW_SP_IS_ACTIVE,
      value: isOpen,
    })

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])

  const initState = privateDists?.data?.sort(
    (a: BotInfoInterface, b: BotInfoInterface) => a.id - b.id
  )

  const data = initState?.map((el: BotInfoInterface) => {
    const components = getAllComponents(el.name || '')
    const result = components.data?.skills
      ?.filter(el => el.name !== 'dummy_skill')
      .map((el: ISkill) => {
        const resultExamination = examination(el)
        return { name: el.display_name, data: resultExamination, skill: el }
      })

    return { name: el.display_name, skill: result, bot: el }
  })

  const renderMessage = (key: string, data: ICollectionError) => {
    if (data[key].length === 0) {
      return null
    }
    const message = data[key].map((el: string, i: number) => {
      return (
        <div
          key={i}
          className={`${s.errorContend}  ${
            i === 0 && key === 'error' ? s.first : ''
          }`}
        >
          <div className={s.verticalLine}></div>
          <div className={s.cluster}></div>
          <div className={s.hederError}>
            {key === 'error' ? <Error /> : <Warning />}
            <span className={s.infoAll}>{el}</span>
          </div>
        </div>
      )
    })

    return message
  }

  const renderSkillAssistant = (
    skill: ICustomSkill,
    bot: BotInfoInterface,
    i: number
  ) => {
    const errorCount = skill.data.error.length
    const warningCount = skill.data.warning.length

    if (errorCount === 0 && warningCount === 0) {
      return null
    }

    const handleEditBtnClick = (e: React.MouseEvent, skill: IStackElement) => {
      skillEditorOpened('skill_block', skill)
      if (skill.component_type === ('Generative' as any)) {
        nav(
          generatePath(RoutesList.editor.skillEditor, {
            name: bot.name as string,
            skillId: skill.component_id,
          } as any)
        )
        e.stopPropagation()
        return
      }
    }

    const countError = skill.data.error.length + skill.data.warning.length
    const messageCountError = countError === 0 ? '' : `(${countError})`

    const colorError =
      skill.data.error.length !== 0
        ? { color: '#b20000' }
        : skill.data.warning.length !== 0
        ? { color: '#FF9500' }
        : {}

    return (
      <div className={s.skill} key={i}>
        <div className={s.skillBlock}>
          <div
            className={s.skillName}
            onClick={e => handleEditBtnClick(e, skill.skill)}
          >
            <div className={`${s.messageCountError}`} style={colorError}>
              {messageCountError}
            </div>
            {skill.name}
          </div>
          <div className={s.errorContendBox}>
            {renderMessage('error', skill.data)}
            {renderMessage('warning', skill.data)}
          </div>
        </div>
      </div>
    )
  }

  const renderAssistant = (
    assistant: ICustomAssistant,
    i: number,
    target?: boolean
  ) => {
    if (!assistant.skill) {
      return null
    }

    const countAllError = assistant.skill.reduce((acc, el: ICustomSkill) => {
      const errorCount = el?.data.error.length
      const warningWarning = el?.data.warning.length
      return acc + errorCount + warningWarning
    }, 0)

    if (countAllError === 0 && target !== true) {
      return null
    }

    const handlEditClick = (e: React.MouseEvent, bot: BotInfoInterface) => {
      const isPublished = bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
      setVaArchitectureOptions('va_block')
      isPublished
        ? trigger('PublicToPrivateModal', { bot, action: 'edit' })
        : navigate(generatePath(RoutesList.editor.skills, { name: bot?.name }))
      e.stopPropagation()
    }

    if (target && countAllError === 0) {
      return (
        <div key={i} className={s.assistantBlock}>
          <div
            className={s.assistantName}
            onClick={(e: React.MouseEvent) => handlEditClick(e, assistant.bot)}
          >
            {assistant.name}
          </div>
          <div className={s.noWarning}>Скилл не имеет ошибок</div>
        </div>
      )
    }

    return (
      <div key={i} className={s.assistantBlock}>
        <div
          className={s.assistantName}
          onClick={(e: React.MouseEvent) => handlEditClick(e, assistant.bot)}
        >
          {assistant.name}
        </div>
        <div className={s.assistantSkills}>
          {assistant.skill.map((e, index: number) =>
            renderSkillAssistant(e, assistant.bot, index)
          )}
        </div>
      </div>
    )
  }

  const contendTitle = (
    <div className={s.contendTitle}>
      <div className={s.title}>{t('header')}</div>
    </div>
  )

  if (!name) {
    return (
      <div className={s.contend}>
        {contendTitle}
        {data?.map(renderAssistant)}
      </div>
    )
  }

  const targetAssistant = data.filter(
    ({ bot }: { bot: BotInfoInterface }) => bot.name === name
  )

  return (
    <div className={s.contend}>
      {contendTitle}
      <div>{renderAssistant(targetAssistant[0], 1, true)}</div>
    </div>
  )
}

export default WarningsInfo
