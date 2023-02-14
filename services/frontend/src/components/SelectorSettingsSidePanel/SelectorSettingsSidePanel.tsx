import { ReactComponent as QuestionIcon } from '@assets/icons/question.svg'
import useTabsManager from '../../hooks/useTabsManager'
import Button from '../../ui/Button/Button'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelName from '../../ui/SidePanelName/SidePanelName'
import { SettingsList } from '../SettingsList/SettingsList'
import { SettingKey } from '../../types/types'
import s from './SelectorSettingsSidePanel.module.scss'
import { useId } from 'react'

export interface SelectorSettings {
  name: string
  settings: SettingKey[]
  desc?: string
  activeTab?: 'Properties' | 'Editor'
  withSelectAll?: boolean
}

const SelectorSettingsSidePanel = ({
  name,
  desc,
  settings,
  activeTab,
  withSelectAll,
}: SelectorSettings) => {
  const [properties, editor] = ['Properties', 'Editor']
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: activeTab ?? properties,
    tabList: new Map([
      [properties, properties],
      [editor, editor],
    ]),
  })
  const settingsId = useId()

  const handleCancelBtnClick = () => {}

  return (
    <>
      <SidePanelHeader>
        <ul role='tablist'>
          {Array.from(tabsInfo.tabs).map(([id, name]) => (
            <li
              role='tab'
              key={id}
              aria-selected={tabsInfo.activeTabId === id}
              onClick={() => tabsInfo.handleTabSelect(id)}>
              {name}
            </li>
          ))}
        </ul>
      </SidePanelHeader>
      <div className={s.selectorSettingsSidePanel}>
        <div role='tabpanel'>
          <SidePanelName>{name}</SidePanelName>
          {tabsInfo.activeTabId === properties && (
            <p className={s.desc}>
              {desc ||
                'Some inormation about this annotator. So me inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator.'}
            </p>
          )}
          {tabsInfo.activeTabId === editor && (
            <form
              onSubmit={e => {
                e.preventDefault()
                console.log(e.currentTarget.elements)
              }}>
              <SettingsList
                key={name}
                id={settingsId}
                settings={settings}
                withSelectAll={withSelectAll}
              />
              <SidePanelButtons>
                <span className={s.help}>
                  <Button theme='secondary'>
                    <QuestionIcon />
                  </Button>
                </span>
                <Button
                  theme='secondary'
                  props={{ onClick: handleCancelBtnClick }}>
                  Cancel
                </Button>
                <Button
                  theme='primary'
                  props={{ type: 'submit', value: 'Submit' }}>
                  Save
                </Button>
              </SidePanelButtons>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default SelectorSettingsSidePanel
