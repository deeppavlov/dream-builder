import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { BotInfoInterface, SkillInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { getComponents } from '../../services/getComponents'
import Button from '../../ui/Button/Button'
import { Accordion } from '../../ui/Accordion/Accordion'
import DateCard from '../DateCard/DateCard'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import useTabsManager from '../../hooks/useTabsManager'
import { srcForIcons } from '../../utils/srcForIcons'
import { componentTypeMap } from '../../Mapping/componentTypeMap'
import { isAnnotator } from '../../utils/isAnnotator'
import { modelTypeMap } from '../../Mapping/modelTypeMap'
import s from './BotInfoSidePanel.module.scss'
import { Loader } from '../Loader/Loader'

interface Props {
  bot: BotInfoInterface
  disabled?: boolean
}

const BotInfoSidePanel: FC<Props> = ({ bot: propBot, disabled }) => {
  const [bot, setBot] = useState<BotInfoInterface>(propBot)
  const [properties] = ['Properties']
  const navigate = useNavigate()
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: properties,
    tabList: new Map([[properties, { name: properties }]]),
  })
  const {
    isLoading: isComponentsLoading,
    error: componentsError,
    data: components,
  } = useQuery(['components', bot?.name], () => getComponents(bot?.name!))

  const handleCloneBtnClick = () => {
    if (!disabled) {
      trigger('AssistantModal', { action: 'clone', bot: bot })
      return
    }

    trigger('SignInModal', {})
  }

  const handlePreviewBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    navigate(`/${bot?.name}`, {
      state: {
        preview: true,
        distName: bot?.name,
        displayName: bot?.name,
      },
    })
  }

  return (
    <>
      <SidePanelHeader>
        <ul role='tablist'>
          {Array.from(tabsInfo.tabs).map(([id, tab]) => (
            <li
              role='tab'
              data-disabled={tab.disabled}
              key={id}
              aria-selected={tabsInfo.activeTabId === id}
              onClick={() => tabsInfo.handleTabSelect(id)}>
              {tab.name}
            </li>
          ))}
        </ul>
      </SidePanelHeader>
      <div className={s.botInfoSidePanel}>
        <div className={s.header}>
          <span className={s.name}>{bot?.display_name}</span>
        </div>
        <div className={s.topContainer}>
          <div className={s.main}>
            <DateCard date={bot?.date_created} />
            <div className={s.table}>
              <div className={s.author}>
                <img src={DeepPavlovLogo} alt='Author' />
                <span>{bot?.author}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={s.container}>
          <p className={s.desc}>{bot?.description}</p>
          <div className={s.accordions}>
            <Loader isLoading={isComponentsLoading} />
            {components &&
              Object.keys(components).map((group: string, id: number) => (
                <Accordion
                  key={id}
                  title={capitalizeTitle(group)}
                  group={group}
                  closed
                  rounded>
                  {group == 'skill_selectors' &&
                    components?.skill_selectors?.length == 0 && (
                      <div className={s.accordionItem}>All Skills</div>
                    )}
                  {group !== 'skill_selectors' &&
                    components[group]?.length == 0 && (
                      <div className={s.accordionItem}>None</div>
                    )}
                  {components[group].map(
                    (item: SkillInfoInterface, id: number) => (
                      <div key={id} className={s.accordionItem}>
                        {group === 'skills' && (
                          <img
                            className={s.icon}
                            src={srcForIcons(
                              componentTypeMap[item?.component_type]
                            )}
                          />
                        )}
                        {isAnnotator(group) && (
                          <img
                            className={s.icon}
                            src={srcForIcons(modelTypeMap[item?.model_type])}
                          />
                        )}
                        {item?.display_name}
                      </div>
                    )
                  )}
                </Accordion>
              ))}
          </div>
        </div>
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handlePreviewBtnClick }}>
            Preview
          </Button>
          <Button theme='primary' props={{ onClick: handleCloneBtnClick }}>
            Clone
          </Button>
        </div>
      </div>
    </>
  )
}

export default BotInfoSidePanel
