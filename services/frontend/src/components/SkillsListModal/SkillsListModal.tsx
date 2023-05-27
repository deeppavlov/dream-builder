import classNames from 'classnames/bind'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router'
import { DEPLOY_STATUS, VISIBILITY_STATUS } from '../../constants/constants'
import { useUIOptions } from '../../context/UIOptionsContext'
import { useAssistants } from '../../hooks/useAssistants'
import { useComponent } from '../../hooks/useComponent'
import { useDeploy } from '../../hooks/useDeploy'
import { useObserver } from '../../hooks/useObserver'
import { toasts } from '../../mapping/toasts'
import { ICreateComponent, TDistVisibility } from '../../types/types'
import { AddButton } from '../../ui/AddButton/AddButton'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Table } from '../../ui/Table/Table'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { SkillList } from '../SkillList/SkillList'
import TableRowsLoader from '../TableRowsLoader/TableRowsLoader'
import s from './SkillsListModal.module.scss'

interface IAddPublicSkill {
  display_name: string
  description: string
}

export const SkillsListModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { UIOptions } = useUIOptions()
  const { name: distName } = useParams()
  const { deleteDeployment } = useDeploy()
  const { getDist, changeVisibility } = useAssistants()
  const { getGroupComponents, create } = useComponent()
  const { data: bot } = getDist({ distName: distName! })
  const { data: skillsList } = getGroupComponents(
    {
      distName: distName || '',
      group: 'skills',
      component_type: 'Generative',
      author_id: 1,
    },
    { enabled: isOpen }
  )
  const rightSidepanelIsActive = UIOptions[consts.RIGHT_SP_IS_ACTIVE]
  const position = {
    overlay: {
      top: 64,
      zIndex: 2,
      right: rightSidepanelIsActive ? '368px' : 0,
      transition: 'all 0.3s linear',
    },
  }
  const cx = classNames.bind(s)

  const handleClose = () => {
    setIsOpen(false)
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }

  const handleOk = () => handleClose()

  const handleAdd = (skill: ICreateComponent) => {
    toast.promise(
      create.mutateAsync(
        { data: skill, distName: distName || '', type: 'skills' },
        {
          onSuccess: () => {
            bot?.deployment?.state === DEPLOY_STATUS.UP &&
              deleteDeployment.mutateAsync(bot).then(() => {
                // unpublish /
                const name = bot?.name!
                const visibility = VISIBILITY_STATUS.PRIVATE as TDistVisibility

                bot?.publish_state !== null &&
                  changeVisibility.mutateAsync({ name, visibility })
              })

            handleClose()
          },
        }
      ),
      toasts.addComponent
    )
  }

  const handleEventUpdate = () => setIsOpen(true)

  useObserver('SkillsListModal', handleEventUpdate)

  return (
    <BaseModal
      skillsListModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      customStyles={position}
      handleClose={handleClose}
    >
      <div
        className={cx(
          'container',
          rightSidepanelIsActive && 'withRightSidePanel'
        )}
      >
        <div className={s.header}>Choose Skill</div>
        <Table
          second='Type'
          withoutDate={rightSidepanelIsActive}
          addButton={
            <AddButton forTable fromScratch onAddRequest={handleClose} />
          }
        >
          {skillsList ? (
            <SkillList
              handleAdd={handleAdd}
              skills={skillsList}
              view={'table'}
              forModal
              type='public'
              withoutDate={rightSidepanelIsActive}
            />
          ) : (
            <TableRowsLoader rowsCount={6} colCount={6} />
          )}
        </Table>
        <div className={s.footer}>
          <Button theme='primary' props={{ onClick: handleOk }}>
            OK
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
