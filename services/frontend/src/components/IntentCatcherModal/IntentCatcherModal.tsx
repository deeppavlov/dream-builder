import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { ReactComponent as TrashIcon } from '@assets/icons/trash_icon.svg'
import { ReactComponent as IntentErrorCircle } from '@assets/icons/intent_error_circle.svg'
import { ReactComponent as IntentWarningCircle } from '@assets/icons/intent_warning_circle.svg'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import Button from '../../ui/Button/Button'
import ExpandableDropdownn from '../ExpandableDropdown/ExpandableDropdown'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './IntentCatcherModal.module.scss'
import { SmallTag } from '../SmallTag/SmallTag'
import { useObserver } from '../../hooks/useObserver'

interface Props {
  /* If have intent in props, then we Edit him.
    If have not, then add new Intent */
  intent?: {
    id: string
    name: string
    examples?: string[]
    regexes: string[]
  }
}

const IntentCatcherModal = ({ intent }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [id, setId] = useState<string>(intent?.id ?? '')
  const [name, setName] = useState<string | null>(intent?.name ?? null)
  const [examples, setExamples] = useState<Array<string>>(
    intent?.examples ?? []
  )
  const [regexes, setRegexes] = useState<Array<string>>(intent?.regexes ?? [])
  const [tabIndex, setTabIndex] = useState(0)
  const [requiredIntentsCount, recommendedIntentsCount] = [10, 50]
  const isIntent = name !== undefined

  const closeModal = () => {
    setName(null)
    setRegexes([])
    setExamples([])
    setIsOpen(false)
  }

  const update = () => {} // Update exist intent
  const create = () => {} // Add new intent

  const updateIntentName = (value: string | null) => {
    if (!value) return
    setName(value)
  }
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    isIntent ? update() : create()
  }

  const handleTabClick = (index: number) => setTabIndex(index)

  const addListItem = (value: string | null) => {
    if (!value) return

    tabIndex === 0
      ? setExamples([value].concat(examples))
      : setRegexes([value].concat(regexes))
  }
  const updateListItem = (index: number, value: string | null) => {
    if (!value) return

    if (tabIndex === 0) {
      setExamples(
        examples.map((v, i) => {
          if (index === i) {
            return value
          }
          return v
        })
      )
    }

    if (tabIndex === 1) {
      setRegexes(
        regexes.map((v, i) => {
          if (index === i) {
            return value
          }
          return v
        })
      )
    }
  }

  const removeListItem = (index: number) => {
    if (tabIndex === 0) {
      setExamples(examples.filter((v, i) => index !== i))
    }

    if (tabIndex === 1) {
      setRegexes(regexes.filter((v, i) => index !== i))
    }
  }

  const handleEventUpdate = (data: { detail: Props }) => {
    const { intent } = data.detail

    if (intent) {
      setName(intent?.name)
      setRegexes(intent.regexes)
      if (intent.examples) setExamples(intent.examples)
    }

    setIsOpen(!isOpen)
  }

  useObserver('IntentCatcherModal', handleEventUpdate)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      // contentLabel='Intet Modal'
      className={s.intentModal}
      style={{
        overlay: {
          zIndex: 5,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}>
      <form className={s.intentModal__form} onSubmit={handleFormSubmit}>
        <div className={s.intentModal__header}>
          <span className={s.intentModal__name}>
            {isIntent ? 'Edit' : 'Add'} Intent:
          </span>
          <Input
            onSubmit={updateIntentName}
            props={{
              placeholder: 'Name of intent',
              value: name ?? undefined,
            }}
          />

          <button onClick={closeModal}>
            <CloseIcon className={s.intentModal__close} />
          </button>
        </div>

        <ul className={s.tabs}>
          <li
            className={`${s.tabs__tab} ${
              tabIndex === 0 && s.tabs__tab_selected
            }`}
            onClick={() => handleTabClick(0)}>
            Add text examples
          </li>
          <li
            className={`${s.tabs__tab} ${
              tabIndex === 1 && s.tabs__tab_selected
            }`}
            onClick={() => handleTabClick(1)}>
            Add matching with RegEx
          </li>
        </ul>

        <div className={s.intentModal__body}>
          <span className={s['intentModal__block-name']}>
            {tabIndex === 0 ? 'Add Examples' : 'Add Regular Expressions'}
          </span>
          <div className={s.intentModal__textArea}>
            <TextArea
              onSubmit={addListItem}
              props={{
                placeholder:
                  'Add sample phrase, you can add entities with space between them ',
              }}
            />
          </div>
          <div className={s.intentModal__dropdown}>
            <ExpandableDropdownn
              placeholder='Instruction (click to expand)'
              title='Instruction'>
              <ul>
                <li>raw texts regular</li>
                <li>
                  expressions (which will be preprocessed to separate examples
                  before training) using the following features: () to determine
                  the considered sequence, (bla|blabla) - vertical line to
                  determine or symbol {'(){(0, 1)}'} to determine either
                  precesence or absence of the given in the brackets.
                </li>
              </ul>
              <p>
                For example, from the regular expression{' '}
                <SmallTag>{'(hi! |hello! ){0,1}how are you?'}</SmallTag> two
                examples will be generated:{' '}
                <SmallTag>hi! how are you?</SmallTag> and{' '}
                <SmallTag>hello! how are you?</SmallTag>
              </p>
              <p>
                You also may insert several examples (both texts or regular
                expressions) at once splitting them by a new line.
              </p>
            </ExpandableDropdownn>
          </div>

          <span className={s['intentModal__block-name']}>
            {tabIndex === 0 ? 'Examples' : 'Regular Expressions'}
          </span>

          {(tabIndex === 0 ? examples : regexes).length > 0 && (
            <ul className={`${s.examples} ${s.intentModal__list}`}>
              {(tabIndex === 0 ? examples : regexes).map((value, i) => (
                <li key={value + i}>
                  <label className={s.examples__item}>
                    <Input
                      onSubmit={newValue => updateListItem(i, newValue)}
                      props={{ value }}
                    />
                    <TrashIcon
                      className={s.examples__icon}
                      onClick={() => removeListItem(i)}
                    />
                  </label>
                </li>
              ))}
            </ul>
          )}

          <div className={s.intentModal__desc}>
            <ExpandableDropdownn
              placeholder='Add Description'
              title='Title'
              big
            />
          </div>
        </div>

        <div className={s.intentModal__footer}>
          {examples.length > 0 && (
            <>
              <div
                data-tip={
                  examples.length < requiredIntentsCount
                    ? '10 or more Intents are required'
                    : examples.length < recommendedIntentsCount
                    ? '50 or more Intents are recommended'
                    : ''
                }
                data-for='intentModal__alert_tooltip'
                className={s.intentModal__alert}>
                <span>
                  You added&nbsp;<b>{examples.length}</b>&nbsp;Intents.
                </span>
                {examples.length < requiredIntentsCount && (
                  <IntentErrorCircle />
                )}
                {examples.length >= requiredIntentsCount &&
                  examples.length < recommendedIntentsCount && (
                    <IntentWarningCircle />
                  )}
              </div>
              <ReactTooltip
                id='intentModal__alert_tooltip'
                place='top'
                effect='solid'
                className={s.tooltips}
                arrowColor='#8d96b5'
                offset={{ right: 0, top: 0 }}
                delayShow={1000}
              />
            </>
          )}
          <Button
            theme='primary'
            small
            props={{
              type: 'submit',
              disabled: name === '' || examples.length === 0,
              onClick: closeModal,
            }}>
            Save & Close
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default IntentCatcherModal
