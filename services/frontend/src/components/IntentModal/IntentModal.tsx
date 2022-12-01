import { useState } from 'react'
import Modal from 'react-modal'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { Input } from '../../ui/Input/Input'
import s from './IntentModal.module.scss'
import { TextArea } from '../../ui/TextArea/TextArea'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import ExpandableDropdownn from '../ExpandableDropdown/ExpandableDropdown'

interface Props {
  /* If have intent in props, then we Edit him.
    If have not, then add new Intent */
  intent?: {
    id: string
    name: string
    examples?: string[]
    regexes: string[]
  }
  isOpen: boolean
  setIsOpen: Function
}

const IntentModal = ({ intent, isOpen, setIsOpen }: Props) => {
  const isIntent = intent !== undefined
  const [id, setId] = useState<string>(intent?.id ?? '')
  const [name, setName] = useState<string>(intent?.name ?? '')
  const [examples, setExamples] = useState<Array<string>>(
    intent?.examples ?? []
  )
  const [regexes, setRegexes] = useState<Array<string>>(intent?.regexes ?? [])
  const [tabIndex, setTabIndex] = useState(0)

  const closeModal = () => setIsOpen(false)

  const update = () => {} // Update exist intent
  const create = () => {} // Add new intent

  const handleNameInput = (e: React.ChangeEvent) => {}
  const handleInput = (e: React.ChangeEvent, callbackUpdate: Function) => {}
  const handleTextArea = (e: React.ChangeEvent, callbackUpdate: Function) => {}
  const handleFormSubmit = () => (isIntent ? update() : create())

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
              {isIntent ? 'Edit' : 'Add'} Intent:
            </span>
            <Input placeholder='Name of intent' />
            <button>Button</button>
            <button onClick={closeModal}>
              <CloseIcon className={s.intentModal__close} />
            </button>
          </div>

          <Tabs selectedIndex={tabIndex} onSelect={i => setTabIndex(i)}>
            <TabList className={s.tabs}>
              <Tab
                className={`${s.tabs__tab} ${
                  tabIndex === 0 && s.tabs__tab_selected
                }`}>
                Add text examples
              </Tab>
              <Tab
                className={`${s.tabs__tab} ${
                  tabIndex === 1 && s.tabs__tab_selected
                }`}>
                Add matching with RegEx
              </Tab>
            </TabList>
            <TabPanel>
              <div className={s.intentModal__body}>
                <span className={s['intentModal__block-name']}>
                  Add Examples
                </span>
                <TextArea placeholder='Add sample phrase, you can add entities with space between them ' />
                <ExpandableDropdownn />
                <span className={s['intentModal__block-name']}>Examples</span>
                <ul>
                  <li><Input value={'want pizza'} /></li>
                  <li><Input value={'love pizza'} /></li>
                  <li><Input value={'pizza is my favorite'} /></li>
                  <li><Input value={'wanna pizza'} /></li>
                </ul>
                <ExpandableDropdownn />
              </div>
            </TabPanel>
          </Tabs>

          <div className={s.intentModal__btns}>
            <button type='submit'>Save</button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default IntentModal
