import { ReactComponent as PlusIcon } from 'assets/icons/plus_icon.svg'
import { ISkill } from 'types/types'
import { trigger } from 'utils/events'
import { Button } from 'components/Buttons'
import { Accordion } from 'components/Dropdowns'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import SidePanelStatus from 'components/Panels/SidePanelStatus/SidePanelStatus'
import SkillSidePanel from 'components/Panels/SkillSidePanel/SkillSidePanel'
import IntentList from 'components/Unused/IntentList/IntentList'
import IntentListItem, {
  IntentListItemInterface,
} from 'components/Unused/IntentListItem/IntentListItem'
import s from './IntentResponderSidePanel.module.scss'

export const intentsMock: IntentListItemInterface[] = [
  {
    id: '0',
    name: 'Exit',
    about: 'Bye-bye!',
    status: 'error',
  },
  {
    id: '0',
    name: 'Exit',
    about: 'Bye-bye!',
    status: 'success',
  },
  {
    id: '0',
    name: "what_time | don't_understand",
    about: 'Sorry, I might sound confusing, I am still ...',
    status: 'success',
  },
  {
    id: '0',
    name: 'Bye',
    about: 'Bye, See you, Goodbye, See ya',
    status: 'success',
  },
  {
    id: '0',
    name: 'Stop',
    about: 'stop, stop it, let it stop',
    status: 'warning',
  },
  {
    id: '0',
    name: 'Cancel',
    about: 'Cancel, cancel it',
    status: 'warning',
  },
  {
    id: '0',
    name: 'Fallback',
    about: 'Fallback',
    status: 'success',
  },
]

interface Props {
  skill: ISkill
  activeTab?: 'Properties' | 'Editor'
  disabled?: boolean
}

const IntentResponderSidePanel = ({ skill, activeTab, disabled }: Props) => {
  const handleCloseBtnClick = () =>
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })

  const handleAddIntentBtnClick = () => {
    trigger('IntentResponderModal', {})
  }

  const handleSaveBtnClick = () => {}

  return (
    <SkillSidePanel skill={skill} activeTab={activeTab}>
      <div className={s.intentResponder}>
        <div className={s.name}>Intent Responder</div>
        <Button
          theme='secondary'
          long
          props={{ onClick: handleAddIntentBtnClick }}
        >
          <PlusIcon />
          Add Intent Responder
        </Button>
        <IntentList>
          <Accordion isActive title='User-customized' small>
            {intentsMock.map(({ id, name, about, status }) => (
              <IntentListItem
                key={id}
                id={id}
                name={name}
                about={about}
                status={status}
              />
            ))}
          </Accordion>
          <Accordion isActive title='Prebuilt' small>
            {intentsMock.map(({ id, name, about }) => (
              <IntentListItem
                key={id}
                id={id}
                name={name}
                about={about}
                status='default'
              />
            ))}
          </Accordion>
        </IntentList>
        <div className={s.attention}>
          <span className={s.attention__name}>Attention!</span>
          <p className={s.attention__desc}>
            Instructions:
            <br />
            Now you can add special answers for your Intents, if you want to
            make them high Priority
          </p>
        </div>
        <div className={s.intentResponder__btns}>
          <Button theme='primary' props={{ onClick: handleSaveBtnClick }}>
            Save
          </Button>
        </div>
      </div>
      {disabled && (
        <SidePanelStatus
          status='default'
          title='Sorry, training is not yet available.'
          desc='Stay tuned for the upcoming updates!'
        >
          <Button theme='secondary' props={{ onClick: handleCloseBtnClick }}>
            Close
          </Button>
        </SidePanelStatus>
      )}
    </SkillSidePanel>
  )
}

export default IntentResponderSidePanel
