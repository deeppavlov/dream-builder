import { ReactComponent as Information } from '@assets/icons/information.svg'
import classNames from 'classnames/bind'
import { useAuth, useUIOptions } from 'context'
import { CSSProperties, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from 'react-query'
import { BotInfoInterface, ISkill, IСounter } from 'types/types'
import { TOOLTIP_DELAY } from 'constants/constants'
import { getComponents } from 'api/components'
import { useAssistants, useComponent } from 'hooks/api'
import { useGaDeepy } from 'hooks/googleAnalytics/useGaDeepy'
import { examination } from 'utils/checkingAssistants'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { BaseToolTip } from 'components/Menus'
import { WarningsInfo } from 'components/Panels'
import { TRIGGER_LEFT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Hint } from 'components/UI'
import s from './AssistantMenuInfo.module.scss'

export const HELPER_TAB_ID = 'helperTabError'

export const AssistantMenuInfo = () => {
  const { fetchPrivateDists } = useAssistants()
  const privateDistsInit = fetchPrivateDists()
  const { user } = useAuth()
  const { UIOptions } = useUIOptions()
  const { deepyChatOpened } = useGaDeepy()
  const { t } = useTranslation('translation', { keyPrefix: 'sidebar.tooltips' })
  const copilotIsActive = UIOptions[consts.WARNING_WINDOW_SP_IS_ACTIVE]
  const [hintIsVisited, setHintIsVisited] = useState<boolean>(
    JSON.parse(`${localStorage.getItem(`${HELPER_TAB_ID}_IS_VISITED`)}`) ===
      true
  )

  const [privateDists, setPrivateDists] = useState({})

  useEffect(() => {
    if (privateDistsInit.status === 'success') {
      setPrivateDists(privateDistsInit)
    }
  }, [privateDistsInit.data])

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

  const sortedDists = privateDists?.data
    ? privateDists?.data.sort(
        (a: BotInfoInterface, b: BotInfoInterface) => a.id - b.id
      )
    : []

  const { data: componentsList } = useQuery(
    ['user_skills', user?.id],
    () =>
      Promise.all(
        sortedDists.map(async (el: BotInfoInterface) => {
          const acc = { countError: 0, countWarning: 0 }
          const components = await getComponents(el.name) // no error handling
          components.skills
            .filter((el: ISkill) => el.name !== 'dummy_skill')
            .forEach((el: ISkill) => {
              const resultExamination = examination(el)
              acc.countError += resultExamination.error.length
              acc.countWarning += resultExamination.warning.length
            })
          return acc
        })
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: sortedDists?.length! > 0,
      initialData: [],
    }
  )

  const count = componentsList?.reduce(
    (acc: IСounter, el: IСounter) => {
      const countError = el.countError
      const countWarning = el.countWarning
      acc.countError += countError
      acc.countWarning += countWarning
      return acc
    },
    { countError: 0, countWarning: 0 }
  )

  const RenderCountError = () => {
    const icon = <Information style={{ width: 24, height: 24 }} />

    if (count.countError !== 0) {
      return (
        <div className={s.iconError}>
          <div className={`${s.count} ${s.error}`}>{count.countError}</div>
          {icon}
        </div>
      )
    }
    if (count.countWarning !== 0) {
      return (
        <div className={s.iconError}>
          <div className={`${s.count} ${s.warning}`}>{count.countWarning}</div>
          {icon}
        </div>
      )
    }
    return icon
  }

  const myStyle: CSSProperties =
    count.countError === 0 && count.countWarning === 0
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
          text={'Ошибки'}
          handleClose={() => setHintIsVisited(true)}
        />
      )}
    </button>
  )
}
