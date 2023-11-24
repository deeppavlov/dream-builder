import { ReactComponent as Error } from '@assets/icons/errorIcon.svg'
import { ReactComponent as Warning } from '@assets/icons/warningIcon.svg'
import { useUIOptions } from 'context'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import {
  BotInfoInterface,
  ICollectionError,
  IMassage,
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
  const { t } = useTranslation('translation', { keyPrefix: 'sidepanels.deepy' })
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

  const renderMassage = (key: string, data: ICollectionError) => {
    if (data[key].length === 0) {
      return null
    }
    const massage = data[key].map((el: IMassage, i: number) => {
      return (
        <div
          key={i}
          className={`${s.errorContend}  ${
            i === 0 && key === 'error' ? s.first : ''
          }`}
        >
          <div className={s.Vline}></div>
          <div className={s.cluster}></div>
          <div className={s.hederError}>
            {key === 'error' ? <Error /> : <Warning />}
            <span className={s.infoAll}>{el.massage}</span>
          </div>
        </div>
      )
    })
    return massage
  }

  const renderSkillAssistant = (
    skills: any,
    bot: BotInfoInterface,
    i: number
  ) => {
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

    const countError = skills.data.error.length + skills.data.warning.length
    const massageCountError = countError === 0 ? '' : `(${countError})`

    const colorError =
      skills.data.error.length !== 0
        ? { color: '#b20000' }
        : skills.data.warning.length !== 0
        ? { color: '#FF9500' }
        : {}

    return (
      <div className={s.skill} key={i}>
        <div className={s.skillBlock}>
          <div
            className={s.skillName}
            onClick={e => handleEditBtnClick(e, skills.skill)}
          >
            <div className={`${s.massageCountError}`} style={colorError}>
              {massageCountError}
            </div>
            {skills.name}
          </div>
          {renderMassage('error', skills.data)}
          {renderMassage('warning', skills.data)}
        </div>
      </div>
    )
  }

  const renderAssistant = (
    assistant: {
      name: string
      skill: ICollectionError[]
      bot: BotInfoInterface
    },
    i: number
  ) => {
    if (!assistant.skill) {
      return null
    }

    const handlEditClick = (
      e: React.MouseEvent<HTMLButtonElement>,
      bot: BotInfoInterface
    ) => {
      const isPublished = bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
      setVaArchitectureOptions('va_block')
      isPublished
        ? trigger('PublicToPrivateModal', { bot, action: 'edit' })
        : navigate(generatePath(RoutesList.editor.skills, { name: bot?.name }))
      e.stopPropagation()
    }

    return (
      <div key={i} className={s.assistantBlock}>
        <div
          className={s.assistantName}
          onClick={(e: any) => handlEditClick(e, assistant.bot)}
        >
          {assistant.name}
        </div>
        {assistant.skill.map((e, index: number) =>
          renderSkillAssistant(e, assistant.bot, index)
        )}
      </div>
    )
  }

  const contendTitle = (
    <div className={s.contendTitle}>
      <div className={s.title}>Errors</div>
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
      <div>{targetAssistant.map(renderAssistant)}</div>
    </div>
  )
}

export default WarningsInfo
