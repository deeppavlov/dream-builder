import { ReactComponent as Information } from '@assets/icons/information.svg'
import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { CSSProperties, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UseQueryResult } from 'react-query'
import { BotInfoInterface, ICounter, ISkill } from 'types/types'
import { useAssistants, useComponent } from 'hooks/api'
import { useGaDeepy } from 'hooks/googleAnalytics/useGaDeepy'
import { examination } from 'utils/checkingAssistants'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { BaseToolTip } from 'components/Menus'
import { WarningsInfo } from 'components/Panels'
import { TRIGGER_LEFT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import s from './AssistantMenuInfo.module.scss'

export const HELPER_TAB_ID = 'helperTabError'

export const AssistantMenuInfo = () => {
  const { fetchPrivateDists } = useAssistants()
  const privateDists = fetchPrivateDists()
  const { UIOptions } = useUIOptions()
  const { getAllComponentsArr } = useComponent()
  const { deepyChatOpened } = useGaDeepy()
  const { t } = useTranslation('translation', {
    keyPrefix: 'assistantMenuInfo',
  })
  const copilotIsActive = UIOptions[consts.WARNING_WINDOW_SP_IS_ACTIVE]

  let cx = classNames.bind(s)

  const handleBtnClick = () => {
    !copilotIsActive && deepyChatOpened()

    trigger(TRIGGER_LEFT_SP_EVENT as any, {
      children: <WarningsInfo />,
      isOpen: !copilotIsActive,
    })
  }

  const sortedDists = privateDists?.data
    ? privateDists?.data.sort(
        (a: BotInfoInterface, b: BotInfoInterface) => a.id - b.id
      )
    : []

  const userQueries = getAllComponentsArr(sortedDists)

  const count = userQueries?.reduce(
    (acc: ICounter, el) => {
      if (el.isSuccess) {
        el.data.skills
          .filter((el: ISkill) => el.name !== 'dummy_skill')
          .forEach((el: ISkill) => {
            const resultExamination = examination(el)
            acc.errors += resultExamination.errors.length
            acc.warnings += resultExamination.warnings.length
          })
      }
      return acc
    },
    { errors: 0, warnings: 0 }
  )

  const RenderCountError = () => {
    const icon = <Information style={{ width: 24, height: 24 }} />

    if (count.errors !== 0) {
      return (
        <div className={s.iconError}>
          <div className={`${s.count} ${s.error}`}>
            {count.errors <= 99 ? count.errors : '99+'}
          </div>
          {icon}
        </div>
      )
    }
    if (count.warnings !== 0) {
      return (
        <div className={s.iconError}>
          <div className={`${s.count} ${s.warning}`}>
            {count.warnings <= 99 ? count.warnings : '99+'}
          </div>
          {icon}
        </div>
      )
    }
    return icon
  }

  const myStyle: CSSProperties =
    count?.errors === 0 && count.warnings === 0
      ? { pointerEvents: 'none', opacity: 0.3 }
      : {}

  return (
    <button
      style={myStyle}
      id={HELPER_TAB_ID}
      data-tooltip-id={HELPER_TAB_ID}
      className={cx('icon', copilotIsActive && 'active')}
      onClick={handleBtnClick}
    >
      <RenderCountError />

      <BaseToolTip id={HELPER_TAB_ID} content={t('errors')} place='right' />
    </button>
  )
}
