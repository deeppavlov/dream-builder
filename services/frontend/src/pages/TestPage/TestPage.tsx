import { nanoid } from 'nanoid'
import AnnotatorSidePanel from '../../components/AnnotatorSidePanel/AnnotatorSidePanel'
import BaseLink from '../../components/BaseLink/BaseLink'
import BaseSidePanel, {
  BASE_SP_EVENT,
} from '../../components/BaseSidePanel/BaseSidePanel'
import BotInfoSidePanel from '../../components/BotInfoSidePanel/BotInfoSidePanel'
import DialogSidePanel from '../../components/DialogSidePanel/DialogSidePanel'
import FAQSidePanel from '../../components/FAQSidePanel/FAQSidePanel'
import IntentCatcherSidePanel from '../../components/IntentCatcherSidePanel/IntentCatcherSidePanel'
import IntentList from '../../components/IntentList/IntentList'
import IntentListItem, {
  IntentListItemInterface,
} from '../../components/IntentListItem/IntentListItem'
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
import SelectorSettingsSidePanel, {
  SelectorSettings,
} from '../../components/SelectorSettingsSidePanel/SelectorSettingsSidePanel'
import { Accordion } from '../../ui/Accordion/Accordion'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { CreateSkillModal } from '../../components/CreateSkillModal/CreateSkillModal'
import { trigger } from '../../utils/events'
import s from './TestPage.module.scss'
import { dateToUTC } from '../../utils/dateToUTC'
import ResourcesTable from '../../components/ResourcesTable/ResourcesTable'
import { BotCard } from '../../components/BotCard/BotCard'
import CompanyLogo from '@assets/icons/pavlovInCard.svg'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { SkillCard } from '../../components/SkillCard/SkillCard'
import SkillPromptModal from '../../components/SkillPromptModal/SkillPromptModal'
import CreateSkillDistModal from '../../components/CreateSkillDistModal/CreateSkillDistModal'
import ChooseBotModal from '../../components/ChooseBotModal/ChooseBotModal'
import IntentCatcherModal from '../../components/IntentCatcherModal/IntentCatcherModal'
import { BotInfoInterface, TotalResourcesInterface } from '../../types/types'
import GenerativeSkillEditor from '../../components/GenerativeSkillEditor/GenerativeSkillEditor'

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

const mockSkill = {
  isEditing: true,
  name: 'Name of The Skill 1',
  skillType: 'fallbacks',
  author: 'Name of The Company',
  desc: 'Helps users locate the nearest store. And we can write 3 lines here and this is maximum about',
  dateCreated: dateToUTC(new Date()),
  version: '0.01',
  ram: '0.0 GB',
  gpu: '0.0 GB',
}

const mockAnnotator = {
  name: 'Intent Catcher',
  author: 'Deep Pavlov',
  authorImg: DeepPavlovLogo,
  type: 'Dictionary — &Pattern-based',
  desc: 'Some inormation about this annotator. So me inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator. Some inormation about this annotator.',
}

const mockBot: BotInfoInterface = {
  name: 'Name of the bot',
  routingName: 'dream_russian',
  author: 'Name of the company',
  authorImg: DeepPavlovLogo,
  dateCreated: dateToUTC(new Date()),
  desc: 'Some information about this bot writing in 2 lines',
  version: '0.0.1',
  ram: '0.0 GB',
  gpu: '0.0 GB',
  space: '0.0 GB',
}

const mockTotalRes: TotalResourcesInterface = {
  proxy: {
    containers: '30',
    ram: '0.0 GB',
    gpu: '0.0 GB',
    space: '0.0 GB',
  },
}

const mockResponseSelector: SelectorSettings = {
  name: 'Tag-& Evaluation-based Selector',
  settings: [
    {
      name: 'HIGH_PRIORITY_INTENTS',
      type: 'switch',
    },
    {
      name: 'RESTRICTION_FOR_SENSITIVE_CASE',
      type: 'switch',
    },
    {
      name: 'ALWAYS_TURN_ON_ALL_SKILLS',
      type: 'switch',
      checked: true,
    },
    {
      name: 'ALWAYS_TURN_ON_GIVEN_SKILL',
      type: 'switch',
    },
    {
      name: 'LANGUAGE',
      type: 'switch',
      value: ['ENG', 'RU'],
    },
  ],
}

const mockRuleBasesSkillSelector: SelectorSettings = {
  name: 'Rule-based Skill Selector',
  settings: [
    {
      name: 'MAX_TURNS_WITHOUT_SCRIPTS',
      type: 'input',
      value: '7',
    },
    {
      name: 'CALL_BY_NAME_PROBABILITY',
      type: 'input',
      value: '0.5',
    },
    {
      name: 'PROMPT_PROBA',
      type: 'input',
      value: '0.3',
    },
    {
      name: 'ACKNOWLEDGEMENT_PROBA',
      type: 'input',
      value: '0.3',
    },
    {
      name: 'CONFIDENCE_STRENGTH',
      type: 'input',
      value: '0.8',
    },
    {
      name: 'CONV_EVAL_STRENGTH',
      type: 'input',
      value: '0.4',
    },
    {
      name: 'QUESTION_TO_QUESTION_DOWNSCORE_COEF',
      type: 'input',
      value: '0.8',
    },
    {
      name: 'PRIORITIZE_WITH_REQUIRED_ACT',
      type: 'switch',
    },
    {
      name: 'PRIORITIZE_NO_DIALOG_BREAKDOWN',
      type: 'switch',
    },
    {
      name: 'PRIORITIZE_WITH_SAME_TOPIC_ENTITY',
      type: 'switch',
    },
    {
      name: 'IGNORE_DISLIKED_SKILLS',
      type: 'switch',
      checked: true,
    },
    {
      name: 'GREETING_FIRST',
      type: 'switch',
    },
    {
      name: 'RESTRICTION_FOR_SENSITIVE_CASE',
      type: 'switch',
    },
    {
      name: 'PRIORITIZE_PROMTS_WHEN_NO_SCRIPTS',
      type: 'switch',
    },
    {
      name: 'MAX_TURNS_WITHOUT_SCRIPTS',
      type: 'switch',
    },
    {
      name: 'PRIORITIZE_SCRIPTED_SKILLS',
      type: 'switch',
    },
    {
      name: 'PRIORITIZE_HUMAN_INITIATIVE',
      type: 'switch',
    },
  ],
}

const mockSingleSkillSelector: SelectorSettings = {
  name: 'Single Skill Selector',
  settings: [
    {
      name: 'GPT-J Chit-Chat',
      type: 'radio',
    },
    {
      name: 'DFF Intent Responder Skill',
      type: 'radio',
    },
    {
      name: 'FAQ',
      type: 'radio',
    },
    {
      name: 'DialoGPT + Persona',
      type: 'radio',
    },
    {
      name: 'DFF Program-Y Skill',
      type: 'radio',
    },
    {
      name: 'Dummy Skill',
      type: 'radio',
    },
    {
      name: 'DialoGPT',
      type: 'radio',
    },
  ],
}

const mockMultipleSkillSelector: SelectorSettings = {
  name: 'Multiple Skill Selector',
  settings: [
    {
      name: 'GPT-J Chit-Chat',
      type: 'checkbox',
    },
    {
      name: 'DFF Intent Responder Skill',
      type: 'checkbox',
    },
    {
      name: 'FAQ',
      type: 'checkbox',
    },
    {
      name: 'DialoGPT + Persona',
      type: 'checkbox',
      checked: true,
    },
    {
      name: 'DFF Program-Y Skill',
      type: 'checkbox',
    },
    {
      name: 'Dummy Skill',
      type: 'checkbox',
    },
    {
      name: 'DialoGPT',
      type: 'checkbox',
    },
  ],
}

export const TestPage = () => {
  return (
    <div className={s.testPage}>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>Modals</span>
        <div className={s.testPage__component}>
          <span>CreateAssistantModal</span>
          <Button
            theme='primary'
            props={{ onClick: () => trigger('CreateAssistantModal', {}) }}>
            CreateAssistantModal
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>CreateSkillModal</span>
          <Button
            theme='primary'
            props={{ onClick: () => trigger('CreateSkillModal', {}) }}>
            CreateSkillModal (add)
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: () => trigger('CreateSkillModal', mockSkill),
            }}>
            CreateSkillModal (edit)
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>SkillPromptModal</span>
          <Button
            theme='primary'
            props={{
              onClick: () => trigger('SkillPromptModal', { skill: mockSkill }),
            }}>
            SkillPromptModal (add)
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: () =>
                trigger('SkillPromptModal', {
                  skill: mockSkill,
                  isEditingModal: true,
                }),
            }}>
            SkillPromptModal (edit)
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>CreateSkillDistModal</span>
          <Button
            theme='primary'
            props={{
              onClick: () => trigger('CreateSkillDistModal', mockSkill),
            }}>
            CreateSkillDistModal
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>ChooseBotModal</span>
          <Button
            theme='primary'
            props={{ onClick: () => trigger('ChooseBotModal', mockSkill) }}>
            ChooseBotModal
          </Button>
        </div>

        <div className={s.testPage__component}>
          <span>IntentCatcherModal</span>
          <Button
            theme='primary'
            props={{ onClick: () => trigger('IntentCatcherModal', {}) }}>
            IntentCatcherModal (add)
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: () =>
                trigger('IntentCatcherModal', {
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
                }),
            }}>
            IntentCatcherModal (edit)
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>IntentResponderModal</span>
          <Button
            theme='primary'
            props={{
              onClick: () =>
                trigger('IntentResponderModal', {
                  intents: [
                    {
                      id: nanoid(8),
                      name: 'yes',
                      type: 'custom',
                    },
                  ],
                }),
            }}>
            IntentResponderModal (add)
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: () =>
                trigger('IntentResponderModal', {
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
                }),
            }}>
            IntentResponderModal (edit)
          </Button>
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>SidePanels</span>
        <div className={s.testPage__component}>
          <span>BaseSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, { children: <>Test</> })
              },
            }}>
            BaseSidePanel
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>AnnotatorSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <AnnotatorSidePanel key={0} annotator={mockAnnotator} />
                  ),
                })
              },
            }}>
            AnnotatorSidePanel (Properties)
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <AnnotatorSidePanel
                      key={1}
                      annotator={mockAnnotator}
                      activeTab='Editor'>
                      Editor tab content
                    </AnnotatorSidePanel>
                  ),
                })
              },
            }}>
            AnnotatorSidePanel (Editor)
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>IntentCatcherSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <IntentCatcherSidePanel key={0} annotator={mockAnnotator} />
                  ),
                })
              },
            }}>
            IntentCatcherSidePanel
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>SkillSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <SkillSidePanel
                      skill={{
                        name: 'Name of The Skill',
                        author: 'Deep Pavlov',
                        authorImg: DeepPavlovLogo,
                        skillType: 'fallbacks',
                        botName: 'Name of The Bot',
                        desc: 'Helps users locate the nearest store. And we can write 3 lines here and this is maximum about skill info infoinfo',
                        dateCreated: dateToUTC(new Date()),
                        version: '0.01',
                        ram: '0.0 GB',
                        gpu: '0.0 GB',
                        executionTime: '0.0 ms',
                      }}
                    />
                  ),
                })
              },
            }}>
            SkillSidePanel
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>GenerativeSkillEditor</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <GenerativeSkillEditor
                      activeTab='Editor'
                      skill={{
                        name: 'Name of The Skill',
                        author: 'Deep Pavlov',
                        authorImg: DeepPavlovLogo,
                        skillType: 'fallbacks',
                        botName: 'Name of The Bot',
                        desc: 'Helps users locate the nearest store. And we can write 3 lines here and this is maximum about skill info infoinfo',
                        dateCreated: dateToUTC(new Date()),
                        version: '0.01',
                        ram: '0.0 GB',
                        gpu: '0.0 GB',
                        executionTime: '0.0 ms',
                        model: 'GPT-3',
                      }}
                    />
                  ),
                })
              },
            }}>
            GenerativeSkillEditor
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>IntentResponderSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <IntentResponderSidePanel
                      skill={{
                        name: 'Name of The Skill',
                        author: 'Deep Pavlov',
                        authorImg: DeepPavlovLogo,
                        skillType: 'fallbacks',
                        botName: 'Name of The Bot',
                        desc: 'Helps users locate the nearest store. And we can write 3 lines here and this is maximum about skill info infoinfo',
                        dateCreated: dateToUTC(new Date()),
                        version: '0.01',
                        ram: '0.0 GB',
                        gpu: '0.0 GB',
                        executionTime: '0.0 ms',
                      }}
                    />
                  ),
                })
              },
            }}>
            IntentResponderSidePanel
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>FAQSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <FAQSidePanel
                      skill={{
                        name: 'Name of The Skill',
                        author: 'Deep Pavlov',
                        authorImg: DeepPavlovLogo,
                        skillType: 'q_a',
                        botName: 'Name of The Bot',
                        desc: 'Helps users locate the nearest store. And we can write 3 lines here and this is maximum about skill info infoinfo',
                        dateCreated: dateToUTC(new Date()),
                        version: '0.01',
                        ram: '0.0 GB',
                        gpu: '0.0 GB',
                        executionTime: '0.0 ms',
                      }}
                    />
                  ),
                })
              },
            }}>
            FAQSidePanel
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>DialogSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: <DialogSidePanel key={0} start />,
                })
              },
            }}>
            DialogSidePanel (start)
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: <DialogSidePanel key={1} />,
                })
              },
            }}>
            DialogSidePanel (chatting)
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: <DialogSidePanel key={2} error />,
                })
              },
            }}>
            DialogSidePanel (error)
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>BotInfoSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: <BotInfoSidePanel bot={mockBot} />,
                })
              },
            }}>
            BotInfoSidePanel
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>NotificationsSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, { children: <NotificationsSidePanel /> })
              },
            }}>
            NotificationsSidePanel
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>ResourcesSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: <ResourcesSidePanel resources={mockTotalRes} />,
                })
              },
            }}>
            ResourcesSidePanel
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>SelectorSettingsSidePanel</span>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <SelectorSettingsSidePanel {...mockResponseSelector} />
                  ),
                })
              },
            }}>
            Response Selector
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <SelectorSettingsSidePanel
                      {...mockRuleBasesSkillSelector}
                    />
                  ),
                })
              },
            }}>
            Rule-based Skill Selector
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <SelectorSettingsSidePanel {...mockSingleSkillSelector} />
                  ),
                })
              },
            }}>
            Single Skill Selector
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: () => {
                trigger(BASE_SP_EVENT, {
                  children: (
                    <SelectorSettingsSidePanel
                      {...mockMultipleSkillSelector}
                      withSelectAll
                    />
                  ),
                })
              },
            }}>
            Multiple Skill Selector
          </Button>
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
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>ResourcesTable</span>
        <ResourcesTable
          values={[
            { name: 'RAM', value: '85.3 GB' },
            { name: 'GPU', value: '0.9 GB' },
            { name: 'Disk space', value: '110.0 GB' },
            { name: 'Execution time', value: '0.1 sec' },
          ]}
        />
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>BotCard</span>
        <div className={s.testPage__component}>
          <span>public</span>
          <BotCard
            type='public'
            name='Name of the bot'
            routingName='#'
            author='Name of the company'
            authorImg={CompanyLogo}
            dateCreated={dateToUTC(new Date())}
            desc='Some information about this bot writing in 2 lines'
            version='0.0.1'
            ram='0.0 GB'
            gpu='0.0 GB'
            space='0.0 GB'
          />
        </div>
        <div className={s.testPage__component}>
          <span>your</span>
          <BotCard
            type='your'
            routingName='#'
            name='Name of the bot'
            author='Name of the company'
            authorImg={CompanyLogo}
            dateCreated={dateToUTC(new Date())}
            desc='Some information about this bot writing in 2 lines'
            version='0.0.1'
            ram='0.0 GB'
            gpu='0.0 GB'
            space='0.0 GB'
          />
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>SkillCard</span>
        <div className={s.testPage__component}>
          <span>public</span>
          <SkillCard
            type='public'
            name='Name of The Skill1'
            skillType='fallbacks'
            botName='Name of The Bot'
            desc='Helps users locate the nearest store. And we can write 3 lines here and this is maximum about skill info infoinfo'
            dateCreated={dateToUTC(new Date())}
            version='0.01'
            ram='0.0 GB'
            gpu='0.0 GB'
            executionTime='0.0 ms'
          />
        </div>
        <div className={s.testPage__component}>
          <span>your</span>
          <SkillCard
            type='your'
            name='Name of The Skill2'
            skillType='fallbacks'
            botName='Name of The Bot'
            desc='Helps users locate the nearest store. And we can write 3 lines here and this is maximum about skill info infoinfo'
            dateCreated={dateToUTC(new Date())}
            version='0.01'
            ram='0.0 GB'
            gpu='0.0 GB'
            executionTime='0.0 ms'
          />
        </div>
      </div>

      {/* Sidepanels */}
      <BaseSidePanel />

      {/* <SkillSidePanel /> */}
      {/* <BotInfoSidePanel /> */}

      {/* Modals */}
      <CreateAssistantModal />
      <CreateSkillModal />
      <SkillPromptModal />
      <CreateSkillDistModal />
      <ChooseBotModal />
      <IntentCatcherModal />
      <IntentResponderModal />
    </div>
  )
}
