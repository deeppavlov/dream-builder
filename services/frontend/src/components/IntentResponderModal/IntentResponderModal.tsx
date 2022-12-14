import React, { useState } from 'react'
import Modal from 'react-modal'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { ReactComponent as TrashIcon } from '@assets/icons/trash_icon.svg'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import Button from '../../ui/Button/Button'
import ExpandableDropdownn from '../ExpandableDropdown/ExpandableDropdown'
import s from './IntentResponderModal.module.scss'
import DropboxSearch from '../DropboxSearch/DropboxSearch'
import { intentsMock } from '../IntentResponderSidePanel/IntentResponderSidePanel'

export interface IntentInterface {
  id: string
  name: string
  type: 'custom' | 'prebuilt'
  responses?: string[]
}

interface Props {
  intents: IntentInterface[]
  activeIntentId?: string
  isOpen: boolean
  setIsOpen: Function
}

const IntentResponderModal = ({
  intents,
  activeIntentId,
  isOpen,
  setIsOpen,
}: Props) => {
  // If not found intent by id, then take first intent in intents
  const [intent, setIntent] = useState(
    intents.find(({ id }) => activeIntentId === id) ?? intents[0]
  )
  const [responses, setResponses] = useState<Array<string>>(
    intent.responses ?? []
  )

  const closeModal = () => setIsOpen(false)

  /**
   * Update intent responses
   */
  const updateIntent = () => {}

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateIntent()
  }

  const addListItem = (value: string) => setResponses([value].concat(responses))
  const updateListItem = (index: number, value: string) => {
    setResponses(
      responses.map((v, i) => {
        if (index === i) {
          return value
        }
        return v
      })
    )
  }
  const removeListItem = (index: number) => {
    setResponses(responses.filter((v, i) => index !== i))
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel='Intet Modal'
        className={s.intentModal}>
        <form className={s.intentModal__form} onSubmit={handleFormSubmit}>
          <div className={s.intentModal__header}>
            <span className={s.intentModal__name}>
              {responses.length === 0 ? 'Edit Response to Intent:' : 'Add'}{' '}
              Response to Intent:
            </span>
            <DropboxSearch intents={intentsMock} />

            <button className={s.intentModal__close} onClick={closeModal}>
              <CloseIcon />
            </button>
          </div>

          <div className={s.intentModal__body}>
            <span className={s['intentModal__block-name']}>Add Responces</span>
            <div className={s.intentModal__textArea}>
              <TextArea
                onSubmit={addListItem}
                props={{
                  placeholder:
                    'Add sample phrase, you can add entities with space between them',
                }}
              />
            </div>
            <div className={s.intentModal__dropdown}>
              <ExpandableDropdownn title='Instruction (click to expand)' />
            </div>

            <span className={s['intentModal__block-name']}>Responses</span>

            {responses.length > 0 && (
              <ul className={`${s.examples} ${s.intentModal__list}`}>
                {responses.map((value, i) => (
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
          </div>

          <div className={s.intentModal__footer}>
            <Button
              theme='primary'
              small
              props={{
                type: 'submit',
                onClick: closeModal,
              }}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default IntentResponderModal
