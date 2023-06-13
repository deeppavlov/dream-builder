import classNames from 'classnames/bind'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { ISkill } from 'types/types'
import { getPublicAssistants } from 'api/assistants'
import { useObserver } from 'hooks/useObserver'
import { AssistantListItem } from 'components/Tables'
import { Modal, Table, Wrapper } from 'components/UI'
import s from './ChooseBotModal.module.scss'

const ChooseBotModal = () => {
  let cx = classNames.bind(s)
  const [isOpen, setIsOpen] = useState(false)
  const [skill, setSkill] = useState<ISkill | null>(null)

  const closeModal = () => {
    setIsOpen(false)
    setSkill(null)
  }

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = (data: { detail: ISkill }) => {
    const { detail } = data
    setSkill(detail?.name ? detail : null)
    setIsOpen(prev => !prev)
  }

  const {
    isLoading: isAssistantsLoading,
    error: assistantsError,
    data: assistantsData,
  } = useQuery('publicDists', getPublicAssistants)

  useObserver('ChooseBotModal', handleEventUpdate)

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <div className={cx('chooseBotModal')}>
        <button onClick={closeModal}>
          <CloseIcon className={cx('close')} />
        </button>
        <Wrapper title='Choose existing bot'>
          {isAssistantsLoading && <>Loading...</>}
          {!isAssistantsLoading && !assistantsError && assistantsData && (
            <Table>
              {assistantsData?.map((assistant, i: number) => {
                return (
                  <AssistantListItem key={i} type='public' bot={assistant} />
                )
              })}
            </Table>
          )}
        </Wrapper>
      </div>
    </Modal>
  )
}

export default ChooseBotModal
