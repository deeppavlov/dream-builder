import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { ReactComponent as QuestionIcon } from '@assets/icons/question.svg'
import { ISkill, IStackElement, SettingKey } from '../../types/types'
import useTabsManager from '../../hooks/useTabsManager'
import Button from '../../ui/Button/Button'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelName from '../../ui/SidePanelName/SidePanelName'
import { SettingsList } from '../SettingsList/SettingsList'
import s from './SelectorSettingsSidePanel.module.scss'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'

export interface SelectorSettings {
  skill: IStackElement
  settings?: SettingKey[]
  activeTab?: 'Properties' | 'Editor'
  isDisabledEditor?: boolean
  withSelectAll?: boolean
}

const SelectorSettingsSidePanel = ({
  skill,
  settings,
  activeTab,
  isDisabledEditor,
  withSelectAll,
}: SelectorSettings) => {
  const [properties, editor] = ['Properties', 'Editor']
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: activeTab ?? properties,
    tabList: settings
      ? new Map([
          [properties, { name: properties }],
          [editor, { name: editor, disabled: isDisabledEditor }],
        ])
      : new Map([[properties, { name: properties }]]),
  })
  const { dispatch } = useDisplay()
  const settingsId = useId()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const handleCancelBtnClick = () => {}

  const onSubmit = (data: any) => {
    console.log(data)
  }

  useEffect(() => {
    reset() // Remove old settings state
  }, [settings])

  const dispatchTrigger = (isOpen: boolean) =>
    dispatch({
      type: 'set',
      option: {
        id: consts.ACTIVE_SKILL_SP_ID,
        value: isOpen ? skill.name : null,
      },
    })

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])

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
              onClick={() => tabsInfo.handleTabSelect(id)}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </SidePanelHeader>
      <div className={s.selectorSettingsSidePanel}>
        <form onSubmit={handleSubmit(onSubmit)} role='tabpanel'>
          <SidePanelName>{skill.display_name}</SidePanelName>
          {tabsInfo.activeTabId === properties && (
            <p className={s.desc}>
              {skill.description ||
                'Some inormation about this annotator. So me inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator.'}
            </p>
          )}
          {settings && tabsInfo.activeTabId === editor && (
            <>
              <SettingsList
                key={skill.name}
                id={settingsId}
                settings={settings}
                withSelectAll={withSelectAll}
                register={register}
              />
              <SidePanelButtons>
                <span className={s.help}>
                  <Button theme='secondary'>
                    <QuestionIcon />
                  </Button>
                </span>
                <Button
                  theme='secondary'
                  props={{ onClick: handleCancelBtnClick }}
                >
                  Cancel
                </Button>
                <Button
                  theme='primary'
                  props={{ type: 'submit', value: 'Submit' }}
                >
                  Save
                </Button>
              </SidePanelButtons>
            </>
          )}
        </form>
      </div>
    </>
  )
}

export default SelectorSettingsSidePanel
