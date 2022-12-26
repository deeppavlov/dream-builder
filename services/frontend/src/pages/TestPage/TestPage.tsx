import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import AnnotatorsSidePanel from '../../components/AnnotatorsSidePanel/AnnotatorsSidePanel'
import BaseLink from '../../components/BaseLink/BaseLink'
import BaseSidePanel from '../../components/BaseSidePanel/BaseSidePanel'
import BotInfoSidePanel from '../../components/BotInfoSidePanel/BotInfoSidePanel'
import DialogSidePanel from '../../components/DialogSidePanel/DialogSidePanel'
import FAQSidePanel from '../../components/FAQSidePanel/FAQSidePanel'
import IntentCatcherSidePanel from '../../components/IntentCatcherSidePanel/IntentCatcherSidePanel'
import IntentList from '../../components/IntentList/IntentList'
import IntentListItem, {
  IntentListItemInterface,
} from '../../components/IntentListItem/IntentListItem'
import IntentCatcherModal from '../../components/IntentCatcherModal/IntentCatcherModal'
import IntentResponderSidePanel from '../../components/IntentResponderSidePanel/IntentResponderSidePanel'
import { CreateAssistantModal } from '../../components/CreateAssistantModal/CreateAssistantModal'
import IntentResponderModal from '../../components/IntentResponderModal/IntentResponderModal'
import NotificationCard, {
  NotificationCardProps,
} from '../../components/NotificationCard/NotificationCard'
import NotificationsSidePanel from '../../components/NotificationsSidePanel/NotificationsSidePanel'
import ResourcesSidePanel from '../../components/ResourcesSidePanel/ResourcesSidePanel'
import SkillSidePanel from '../../components/SkillSidePanel/SkillSidePanel'
import { SmallTag } from '../../components/SmallTag/SmallTag'
import SelectorSettingsSidePanel from '../../components/SelectorSettingsSidePanel/SelectorSettingsSidePanel'
import { Accordion } from '../../ui/Accordion/Accordion'
import Button from '../../ui/Button/Button'
import SidePanel from '../../ui/SidePanel/SidePanel'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { CreateSkillModal } from '../../components/CreateSkillModal/CreateSkillModal'
import { trigger } from '../../utils/events'
import s from './TestPage.module.scss'

const notificMock: NotificationCardProps[] = [
  {
    topic: 'Skills',
    type: 'skill',
    about: 'DFF Intent Responder Skill',
    status: 'success',
  },
  {
    topic: 'Annotators',
    type: 'annotator',
    about: 'Intent Catcher',
    status: 'success',
    statusCount: 5,
  },
  {
    topic: 'Annotators',
    type: 'annotator',
    about: 'Intent Catcher',
    status: 'training',
  },
  {
    topic: 'Annotators',
    type: 'annotator',
    about: 'Intent Catcher',
    status: 'error',
  },
]

const intentItemsMock: IntentListItemInterface[] = [
  {
    id: nanoid(8),
    name: 'Yes',
    about: 'yes, yeah, alright, ok',
    status: 'default',
  },
  {
    id: nanoid(8),
    name: 'Want_pizza',
    about: 'want pizza, wanna pizza, love pizza, like pizza...',
    status: 'error',
  },
  {
    id: nanoid(8),
    name: "what_time | don't_understand Sorry, I might sound confusing, I am still ...",
    about: 'Sorry, I might sound confusing, I am still ...',
    status: 'warning',
  },
  {
    id: nanoid(8),
    name: 'Fallback',
    about: 'Fallback',
    status: 'success',
  },
  {
    id: nanoid(8),
    name: 'What is the preparatory course?',
    about: 'The preparatory course is a special educational ',
  },
  {
    id: nanoid(8),
    name: 'Fallback',
    about: 'Fallback',
    disabled: true,
  },
]

export const TestPage = () => {
  const getBtnWithModal = (
    ComponentEl: React.FC<{
      isOpen: boolean
      setIsOpen: (state: boolean) => void
    }>,
    btnLabel: string,
    props?: React.PropsWithoutRef<any>
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <Button theme='primary' props={{ onClick: () => setIsOpen(true) }}>
          {btnLabel}
        </Button>
        <ComponentEl isOpen={isOpen} setIsOpen={setIsOpen} {...props} />
      </>
    )
  }

  return (
    <div className={s.testPage}>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>Modals</span>
        <Button
          theme='primary'
          props={{ onClick: () => trigger('CreateAssistantModal', {}) }}>
          CreateAssistantModal
        </Button>
        <CreateAssistantModal />
        <Button
          theme='primary'
          props={{ onClick: () => trigger('CreateSkillModal', {}) }}>
          CreateSkillModal
        </Button>
        <CreateSkillModal />
        <div className={s.testPage__component}>
          <span>IntentCatcherModal</span>
          {getBtnWithModal(IntentCatcherModal, 'Intent Catcher (add)')}
          {getBtnWithModal(IntentCatcherModal, 'Intent Catcher (edit)', {
            intent: {
              id: nanoid(8),
              name: 'want_pizza',
              examples: [
                'want pizza',
                'love pizza',
                'pizza is my favorite',
                'wanna pizza',
              ],
              regexes: ['(i|we) (want|like|wanna) to (order|buy) pizza'],
            },
          })}
        </div>
        <div className={s.testPage__component}>
          <span>IntentResponderModal</span>
          {getBtnWithModal(IntentResponderModal, 'Intent Responder (add)', {
            intents: [
              {
                id: nanoid(8),
                name: 'yes',
                type: 'custom',
              },
            ],
          })}
          {getBtnWithModal(IntentResponderModal, 'Intent Responder (edit)', {
            intents: [
              {
                id: nanoid(8),
                name: 'yes',
                type: 'custom',
                responses: [
                  'Bye-bye!',
                  'Goodbye!',
                  "You're a great listener. Goodbye!",
                  'Being around you makes everything better! Bye!',
                ],
              },
            ],
          })}
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>SidePanels</span>
        {getBtnWithModal(SidePanel, 'default empty (ui-kit)', {
          children: <>default empty sidepanel (ui-kit)</>,
        })}
        {getBtnWithModal(BaseSidePanel, 'default (dream builder)')}
        <div className={s.testPage__component}>
          <span>DialogSidePanel</span>
          {getBtnWithModal(DialogSidePanel, 'Dialog (start)', { start: true })}
          {getBtnWithModal(DialogSidePanel, 'Dialog (chatting)')}
          {getBtnWithModal(DialogSidePanel, 'Dialog (error)', { error: true })}
        </div>
        <div className={s.testPage__component}>
          <span>IntentCatcherSidePanel</span>
          {getBtnWithModal(IntentCatcherSidePanel, 'Intent Catcher', {
            disabled: true,
          })}
        </div>
        <div className={s.testPage__component}>
          <span>IntentResponderSidePanel</span>
          {getBtnWithModal(IntentResponderSidePanel, 'Intent Responder')}
        </div>
        <div className={s.testPage__component}>
          <span>NotificationsSidePanel</span>
          {getBtnWithModal(NotificationsSidePanel, 'Notifications')}
        </div>
        <div className={s.testPage__component}>
          <span>ResourcesSidePanel</span>
          {getBtnWithModal(ResourcesSidePanel, 'Resources')}
        </div>
        <div className={s.testPage__component}>
          <span>FAQSidePanel</span>
          {getBtnWithModal(FAQSidePanel, 'FAQ')}
        </div>
        <div className={s.testPage__component}>
          <span>BotInfoSidePanel</span>
          {getBtnWithModal(BotInfoSidePanel, 'Bot Info')}
        </div>
        <div className={s.testPage__component}>
          <span>AnnotatorsSidePanel</span>
          {getBtnWithModal(AnnotatorsSidePanel, 'Annotators')}
        </div>
        <div className={s.testPage__component}>
          <span>SkillSidePanel</span>
          {getBtnWithModal(SkillSidePanel, 'Skill')}
        </div>
        <div className={s.testPage__component}>
          <span>SelectorSettingsSidePanel</span>
          {getBtnWithModal(SelectorSettingsSidePanel, 'Selector Settings', {
            name: 'Tag-& Evaluation-based Selector',
            type: 'skill',
            settingKeys: [
              {
                name: 'HIGH_PRIORITY_INTENTS',
                type: 'switch',
                value: ['1', '0'],
              },
              {
                name: 'RESTRICTION_FOR_SENSITIVE_CASE',
                type: 'switch',
                value: ['1', '0'],
              },
              {
                name: 'ALWAYS_TURN_ON_ALL_SKILLS',
                type: 'switch',
                value: ['1', '0'],
              },
              {
                name: 'ALWAYS_TURN_ON_GIVEN_SKILL',
                type: 'switch',
                value: ['1', '0'],
              },
              {
                name: 'LANGUAGE',
                type: 'switch',
                value: ['ENG', 'RU'],
              },
              {
                name: 'GPT-J Chit-Chat',
                type: 'checkbox',
              },
              {
                name: 'GPT-J Chit-Chat',
                type: 'radio',
              },
              {
                name: 'GPT-J Chit-Chat',
                type: 'input',
              },
            ],
          })}
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>Buttons</span>
        <div className={s.testPage__component}>
          <span>Regular</span>
          <Button theme='primary'>Regular Large</Button>
          <Button theme='primary' props={{ disabled: true }}>
            Regular Large (disabled)
          </Button>
          <Button theme='primary' small>
            Regular Small
          </Button>
          <Button theme='primary' small props={{ disabled: true }}>
            Regular Small (disabled)
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>Secondary</span>
          <Button theme='secondary'>Secondary Large</Button>
          <Button theme='secondary' props={{ disabled: true }}>
            Secondary Large (disabled)
          </Button>
          <Button theme='secondary' small>
            Secondary Small
          </Button>
          <Button theme='secondary' small props={{ disabled: true }}>
            Secondary Small (disabled)
          </Button>
        </div>
        <Button theme='secondary' long>
          Secondary Large Long
        </Button>
        <div className={s.testPage__component}>
          <span>Tertiary</span>
          <Button theme='tertiary'>Tertiary Large</Button>
          <Button theme='tertiary' props={{ disabled: true }}>
            Tertiary Large (disabled)
          </Button>
          <Button theme='tertiary' small>
            Tertiary Small
          </Button>
          <Button theme='tertiary' small props={{ disabled: true }}>
            Tertiary Small (disabled)
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>Ghost</span>
          <Button theme='ghost'>Ghost button</Button>
          <Button theme='ghost' props={{ disabled: true }}>
            Ghost button
          </Button>
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>Links</span>
        <div className={s.testPage__component}>
          <span>Link1 (expand)</span>
          <BaseLink to='#' theme='expand'>
            Link
          </BaseLink>
          <BaseLink to='#' theme='expand' disabled>
            Link
          </BaseLink>
        </div>
        <div className={s.testPage__component}>
          <span>Link2 (link)</span>
          <BaseLink to='#' theme='link'>
            Link
          </BaseLink>
          <BaseLink to='#' theme='link' disabled>
            Link
          </BaseLink>
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>IntentListItem</span>
        {intentItemsMock.map(({ name, about, status, disabled }, i) => (
          <div key={name + i} className={s.testPage__component}>
            <span>{disabled ? 'disabled' : status ?? 'no status'}</span>
            <IntentListItem
              id={nanoid(8)}
              name={name}
              about={about}
              status={status}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>IntentList</span>
        <IntentList>
          {intentItemsMock.map(({ id, name, about, disabled, status }, i) => (
            <IntentListItem
              key={id}
              id={id}
              name={name}
              about={about}
              disabled={disabled}
              status={status}
            />
          ))}
        </IntentList>
      </div>
      <div className={s.testPage__component}>
        <span className={s['testPage__block-name']}>SmallTag</span>
        <SmallTag>default</SmallTag>
        <SmallTag theme='version'>v0.2.3</SmallTag>
        <SmallTag theme='success'>success</SmallTag>
        <SmallTag isLoading>training</SmallTag>
        <SmallTag theme='error'>error</SmallTag>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>NotificationCard</span>
        {notificMock.map(({ topic, type, about, status, statusCount }, i) => (
          <div key={topic + i} className={s.testPage__component}>
            <span>{statusCount ? 'with count' : status}</span>
            <NotificationCard
              topic={topic}
              type={type}
              about={about}
              status={status}
              statusCount={statusCount}
            />
          </div>
        ))}
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>Accordion</span>
        <div className={s.testPage__component}>
          <span>default</span>
          <Accordion title='Lorem ipsum is placeholder text commonly'>
            <p>
              Lorem ipsum is placeholder text commonly used in the graphic,
              print, and publishing industries for previewing layouts and visual
              mockups
            </p>
          </Accordion>
        </div>
        <div className={s.testPage__component}>
          <span>small</span>
          <Accordion title='Lorem ipsum is placeholder text commonly' small>
            <p>
              Lorem ipsum is placeholder text commonly used in the graphic,
              print, and publishing industries for previewing layouts and visual
              mockups
            </p>
          </Accordion>
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>Input</span>
        <div className={s.testPage__component}>
          <span>default</span>
          <Input props={{ placeholder: 'Assistive text' }} label='Label' />
        </div>
        <div className={s.testPage__component}>
          <span>with value</span>
          <Input
            props={{
              placeholder: 'Assistive text',
              value: 'Text input Text input Text input Text input',
            }}
            label='Label'
          />
        </div>
        <div className={s.testPage__component}>
          <span>error</span>
          <Input
            props={{ placeholder: 'Assistive text' }}
            label='Label'
            errorMessage='Error message'
          />
        </div>
        <div className={s.testPage__component}>
          <span>disabled</span>
          <Input
            props={{ placeholder: 'Assistive text', disabled: true }}
            label='Label'
          />
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>TextArea</span>
        <div className={s.testPage__component}>
          <span>default</span>
          <TextArea
            props={{ placeholder: 'Assistive text' }}
            label='Label'
            about='Instructions'
          />
        </div>
        <div className={s.testPage__component}>
          <span>with value</span>
          <TextArea
            props={{
              placeholder: 'Assistive text',
              value:
                'Text input Text input Text input Text input Text input Text input Text input Text input',
            }}
            label='Label'
            about='Instructions'
          />
        </div>
        <div className={s.testPage__component}>
          <span>error</span>
          <TextArea
            props={{
              placeholder: 'Assistive text',
            }}
            label='Label'
            about='Instructions'
            errorMessage='Error message'
          />
        </div>
        <div className={s.testPage__component}>
          <span>disabled</span>
          <TextArea
            props={{
              placeholder: 'Assistive text',
              disabled: true,
            }}
            label='Label'
            about='Instructions'
          />
        </div>
      </div>
    </div>
  )
}
