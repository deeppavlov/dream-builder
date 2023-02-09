import classNames from 'classnames/bind'
import { ReactComponent as QuestionIcon } from '@assets/icons/question.svg'
import useTabsManager from '../../hooks/useTabsManager'
import Button from '../../ui/Button/Button'
import Switcher from '../../ui/Switcher/Switcher'
import { Checkbox } from '../../ui/Checkbox/Checkbox'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { Input } from '../../ui/Input/Input'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import s from './SelectorSettingsSidePanel.module.scss'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelName from '../../ui/SidePanelName/SidePanelName'
import SmallInput from '../../ui/SmallInput/SmallInput'
import { useId, useState } from 'react'

export interface SettingKey {
  name: string
  type: 'switch' | 'checkbox' | 'radio' | 'input'
  value?: any
}

export interface SelectorSettings {
  type: 'skill' | 'response'
  name: string
  settingKeys: SettingKey[]
  desc?: string
  activeTab?: 'Properties' | 'Editor'
  children?: React.ReactNode
}

interface SelectorSettingsProps extends SelectorSettings {}

const SelectorSettingsSidePanel = ({
  name,
  desc,
  type,
  settingKeys,
  activeTab,
  children,
}: SelectorSettingsProps) => {
  const [properties, editor] = ['Properties', 'Editor']
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: activeTab ?? properties,
    tabList: new Map([
      [properties, properties],
      [editor, editor],
    ]),
  })
  const settingsId = useId()
  const [checkedRadio, setCheckedRadio] = useState<string | null>(
    settingKeys.find(({ type, value }) => type === 'radio' && value === '1')
      ?.name ?? null
  )

  let cx = classNames.bind(s)
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
            <>
              <ul className={s.settings} onChange={(e) => setCheckedRadio(e.target.value)}>
                {settingKeys.map(({ name, type, value }, i) => (
                  <li className={s.field} key={name + i}>
                    {type === 'checkbox' && <Checkbox label={name} checked />}
                    {type === 'radio' && (
                      <RadioButton
                        name={settingsId}
                        id={name}
                        checked={name === checkedRadio}>
                        {name}
                      </RadioButton>
                    )}
                    {type === 'switch' && (
                      <Switcher checked={value === '1'} label={name} />
                    )}
                    {type === 'input' && (
                      <SmallInput label={name} value={value} />
                    )}
                  </li>
                ))}
              </ul>
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
                <Button theme='primary'>Save</Button>
              </SidePanelButtons>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default SelectorSettingsSidePanel
