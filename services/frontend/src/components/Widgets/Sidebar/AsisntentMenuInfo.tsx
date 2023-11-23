import { ReactComponent as Information } from '@assets/icons/information.svg'
import classNames from 'classnames/bind'
import { useAuth, useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useIsFetching,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'
import {
  BotInfoInterface,
  ICollectionError,
  ISkill,
  IСounter,
} from 'types/types'
import { TOOLTIP_DELAY } from 'constants/constants'
import { getComponents } from 'api/components'
import { getComponent } from 'api/components'
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
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { fetchPrivateDists } = useAssistants()
  const privateDists = fetchPrivateDists()
  const { getAllComponents } = useComponent()
  const { UIOptions } = useUIOptions()

  const { deepyChatOpened } = useGaDeepy()
  const { t } = useTranslation('translation', { keyPrefix: 'sidebar.tooltips' })
  const copilotIsActive = UIOptions[consts.WARNING_WINDOW_SP_IS_ACTIVE]
  const [hintIsVisited, setHintIsVisited] = useState<boolean>(
    JSON.parse(`${localStorage.getItem(`${HELPER_TAB_ID}_IS_VISITED`)}`) ===
      true
  )

  const [state, setState] = useState([])

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

  // const initState = privateDists.data.sort(
  //   (a: BotInfoInterface, b: BotInfoInterface) => a.id - b.id
  // )
  // const data = initState?.map((el: BotInfoInterface) => {
  //   const components = getAllComponents(el.name || '') //   На этом этапе он  ругается.  Можно запустить с задержкой  он  отрисует, но будет ругаться на  порядок вызовов хуков.
  //   const result = components.data?.skills
  //     ?.filter(el => el.name !== 'dummy_skill')
  //     .map((el: ISkill) => {
  //       const resultExamination = examination(el)
  //       return { name: el.display_name, data: resultExamination, skill: el }
  //     })
  //   return { name: el.display_name, skill: result, bot: el }
  // })

  // useEffect(() => {
  //   if (privateDists.status === 'success') {
  //     const sortedDists = privateDists.data
  //       ? privateDists.data.sort(
  //           (a: BotInfoInterface, b: BotInfoInterface) => a.id - b.id
  //         )
  //       : []

  //     const { data: componentsList } = useQuery(
  //       ['user_skills', user?.id],
  //       () =>
  //         Promise.all(
  //           sortedDists.map(async el => {
  //             const components = await getComponents(el.name)
  //             const res = { error: 0, warning: 0 }
  //             const result = components.skills
  //               .filter(el => el.name !== 'dummy_skill')
  //               .forEach((el: ISkill) => {
  //                 const resultExamination = examination(el)
  //                 res.error += resultExamination.error.length
  //                 res.warning += resultExamination.warning.length
  //               })

  //             return res
  //           })
  //         ),
  //       {
  //         refetchOnMount: false,
  //         refetchOnWindowFocus: false,
  //         enabled: sortedDists?.length! > 0,
  //         initialData: [],
  //       }
  //     )
  //     setState(componentsList)
  //   }
  // }, [privateDists])

  const sortedDists = privateDists.data
    ? privateDists.data.sort(
        (a: BotInfoInterface, b: BotInfoInterface) => a.id - b.id
      )
    : []

  const { data: componentsList } = useQuery(
    ['user_skills', user?.id],
    () =>
      Promise.all(
        sortedDists.map(async el => {
          const components = await getComponents(el.name)
          const res = { error: 0, warning: 0 }
          const result = components.skills
            .filter(el => el.name !== 'dummy_skill')
            .forEach((el: ISkill) => {
              const resultExamination = examination(el)
              res.error += resultExamination.error.length
              res.warning += resultExamination.warning.length
            })

          return res
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
    (acc: IСounter, el: any) => {
      const countError = el.error
      const countWarning = el.warning
      acc.countError += countError
      acc.countWarning += countWarning
      return acc
    },
    { countError: 0, countWarning: 0 }
  )

  const RenderCountError = () => {
    if (count?.countError !== 0) {
      return (
        <div className={s.iconError}>
          <div className={`${s.count} ${s.error}`}>{count?.countError}</div>
          <Information style={{ width: 22, height: 22 }} />
        </div>
      )
    }
    if (count.countWarning !== 0) {
      return (
        <div>
          <div className={`${s.count} ${s.warning}`}>{count.countWarning}</div>
          <Information style={{ width: 22, height: 22 }} />
        </div>
      )
    }
    return (
      <div>
        <div className={`${s.count} ${s.warning}`}></div>
        <Information style={{ width: 22, height: 22 }} />
      </div>
    )
  }

  return (
    <button
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
