import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import Modal from 'react-modal'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { SkillInfoInterface } from '../../types/types'
import { subscribe, unsubscribe } from '../../utils/events'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { Table } from '../../ui/Table/Table'
import { BotListItem } from '../BotListItem/BotListItem'
import { dateToUTC } from '../../utils/dateToUTC'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { timeToUTC } from '../../utils/timeToUTC'
import { useQuery } from 'react-query'
import { getPublicDists } from '../../services/getPublicDists'
import s from './ChooseBotModal.module.scss'
import { useObserver } from '../../hooks/useObserver'

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
    setIsOpen(!isOpen)
  }

  const {
    isLoading: isAssistantsLoading,
    error: assistantsError,
    data: assistantsData,
  } = useQuery('publicDists', getPublicDists)

  useObserver('ChooseBotModal', handleEventUpdate)

  return (
    <Modal
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10,
        },
        content: {
          width: '100%',
          height: 'fit-content',
          top: '50%',
          left: '50%',
          right: 0,
          bottom: 0,
          overflow: 'visible',
          background: 'none',
          border: 'none',
          borderRadius: 'none',
          padding: '20px',
          transform: 'translate(-50%, -50%)',
        },
      }}
      isOpen={isOpen}
      onRequestClose={closeModal}>
      <div className={cx('chooseBotModal')}>
        <button onClick={closeModal}>
          <CloseIcon className={cx('close')} />
        </button>
        <Wrapper title='Choose existing bot'>
          {isAssistantsLoading && <>Loading...</>}
          {!isAssistantsLoading && !assistantsError && assistantsData && (
            <Table>
              {assistantsData?.map((dist: dist_list, i: number) => {
                const {
                  name,
                  display_name,
                  author,
                  description,
                  version,
                  ram_usage,
                  gpu_usage,
                  disk_usage,
                  date_created,
                } = dist
                const dateCreated = dateToUTC(new Date(date_created))
                const time = timeToUTC(new Date(date_created))
                return (
                  <BotListItem
                    key={i}
                    routingName={name}
                    name={display_name}
                    author={author}
                    authorImg={DeepPavlovLogo}
                    dateCreated={dateCreated}
                    time={time}
                    desc={description}
                    version={version}
                    ram={ram_usage}
                    gpu={gpu_usage}
                    space={disk_usage}
                  />
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
