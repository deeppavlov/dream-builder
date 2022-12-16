import { ReactComponent as QuestionIcon } from '@assets/icons/question.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import s from './SelectorSettingsSidePanel.module.scss'
import Switcher from '../../ui/Switcher/Switcher'
import { CheckBox } from '../../ui/Checkbox/Checkbox'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { Input } from '../../ui/Input/Input'

export interface SettingKey {
  name: string
  type: 'switch' | 'checkbox' | 'radio' | 'input'
  value?: any
}

export interface SelectorSettings {
  name: string
  type: 'skill' | 'response'
  settingKeys: SettingKey[]
}

interface SelectorSettingsProps extends SelectorSettings, SidePanelProps {}

const SelectorSettingsSidePanel = ({
  isOpen,
  setIsOpen,
  position,
  name,
  type,
  settingKeys,
}: SelectorSettingsProps) => {
  const handleCancelBtnClick = () => setIsOpen(false)

  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      name={`${
        type.charAt(0).toUpperCase() + type.slice(1)
      } Selector - Settings`}>
      <div className={s.selectorSettingsSidePanel}>
        <div className={s.selectorSettingsSidePanel__name}>{name}</div>
        <ul className={s.settings}>
          {settingKeys.map(({ name, type, value }, i) => (
            <li className={s.settings__field} key={name + i}>
              {type === 'checkbox' && <CheckBox />}
              {type === 'radio' && <RadioButton />}
              {name}
              {type === 'switch' && <Switcher values={value} />}
              {type === 'input' && <Input />}
            </li>
          ))}
        </ul>
        <div className={s.selectorSettingsSidePanel__btns}>
          <span className={s.selectorSettingsSidePanel__help}>
            <Button theme='secondary'>
              <QuestionIcon />
            </Button>
          </span>
          <Button theme='secondary' props={{ onClick: handleCancelBtnClick }}>
            Cancel
          </Button>
          <Button theme='primary'>Save</Button>
        </div>
      </div>
    </BaseSidePanel>
  )
}

export default SelectorSettingsSidePanel