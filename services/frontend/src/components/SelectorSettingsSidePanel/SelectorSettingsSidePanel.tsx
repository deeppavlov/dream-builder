import { ReactComponent as QuestionIcon } from '@assets/icons/question.svg'
import Button from '../../ui/Button/Button'
import Switcher from '../../ui/Switcher/Switcher'
import { CheckBox } from '../../ui/Checkbox/Checkbox'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { Input } from '../../ui/Input/Input'
import s from './SelectorSettingsSidePanel.module.scss'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import useTabsManager from '../../hooks/useTabsManager'

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
        <div className={s.container}>
          <div className={s.name}>{name}</div>
          {tabsInfo.activeTabId === properties && (
            <p className={s.desc}>
              {desc ||
                'Some inormation about this annotator. So me inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator.'}
            </p>
          )}
          {tabsInfo.activeTabId === editor && (
            <>
              <ul className={s.settings}>
                {settingKeys.map(({ name, type, value }, i) => (
                  <li className={s.field} key={name + i}>
                    {type === 'checkbox' && <CheckBox />}
                    {type === 'radio' && <RadioButton />}
                    {name}
                    {type === 'switch' && <Switcher values={value} />}
                    {type === 'input' && <Input />}
                  </li>
                ))}
              </ul>
              <div className={s.btns}>
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
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default SelectorSettingsSidePanel
