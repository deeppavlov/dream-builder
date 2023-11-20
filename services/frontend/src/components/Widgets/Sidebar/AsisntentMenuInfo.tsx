import { ReactComponent as Information } from '@assets/icons/information.svg'
import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BotInfoInterface, ISkill } from 'types/types'
import { TOOLTIP_DELAY } from 'constants/constants'
import { useAssistants, useComponent } from 'hooks/api'
import { useGaDeepy } from 'hooks/googleAnalytics/useGaDeepy'
import { examination } from 'utils/checkingAssistants'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { BaseToolTip } from 'components/Menus'
import { WarningsInfo } from 'components/Panels'
import { TRIGGER_LEFT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Hint } from 'components/UI'
import s from './AsisntentMenuInfo.module.scss'

export const HELPER_TAB_ID = 'helperTabError'

export const AsisntentMenuInfo = () => {
  const { fetchPrivateDists } = useAssistants()
  const { UIOptions } = useUIOptions()
  const privateDists = fetchPrivateDists()
  const { getAllComponents } = useComponent()
  const { deepyChatOpened } = useGaDeepy()
  const { t } = useTranslation('translation', { keyPrefix: 'sidebar.tooltips' })
  const copilotIsActive = UIOptions[consts.WARNING_WINDOW_SP_IS_ACTIVE]
  const [hintIsVisited, setHintIsVisited] = useState<boolean>(
    JSON.parse(`${localStorage.getItem(`${HELPER_TAB_ID}_IS_VISITED`)}`) ===
      true
  )

  let cx = classNames.bind(s)

  const handleBtnClick = () => {
    !copilotIsActive && deepyChatOpened()

    trigger(TRIGGER_LEFT_SP_EVENT as any, {
      children: <WarningsInfo />,
      isOpen: !copilotIsActive,
    })
    setHintIsVisited(true)
    localStorage.setItem(`${HELPER_TAB_ID}_IS_VISITED`, JSON.stringify(true))
  }

  // useEffect(() => {
  //   const initState = privateDists?.data?.sort(
  //     (a: BotInfoInterface, b: BotInfoInterface) => a.id - b.id
  //   )
  //   const data = initState?.map((el: BotInfoInterface) => {
  //     const components = getAllComponents(el.name || '')
  //     const result = components.data?.skills
  //       ?.filter(el => el.name !== 'dummy_skill')
  //       .map((el: ISkill) => {
  //         const resultExamination = examination(el)
  //         return { name: el.display_name, data: resultExamination, skill: el }
  //       })
  //     return { name: el.display_name, skill: result, bot: el }
  //   })

  //   console.log(data)
  // }, [])

  return (
    <button
      id={HELPER_TAB_ID}
      data-tooltip-id={HELPER_TAB_ID}
      className={cx('icon', copilotIsActive && 'active')}
      onClick={handleBtnClick}
    >
      <div>
        <div className={s.countError}>12</div>
        <Information />
      </div>

      {hintIsVisited ? (
        <BaseToolTip
          delayShow={TOOLTIP_DELAY}
          id={HELPER_TAB_ID}
          content='Ошибки'
          place='right'
        />
      ) : (
        <Hint
          tooltipId={HELPER_TAB_ID}
          name={HELPER_TAB_ID}
          text={t('Ошибки')}
          handleClose={() => setHintIsVisited(true)}
        />
      )}
    </button>
  )
}
