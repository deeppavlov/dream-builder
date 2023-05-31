import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router'
import { generatePath } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { ISkill, TDistVisibility } from 'types/types'
import { DEPLOY_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants, useComponent, useDeploy } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { AddButton, Button } from 'components/Buttons'
import { SkillList } from 'components/Helpers'
import { TableRowsLoader } from 'components/Loaders'
import { BaseModal } from 'components/Modals'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Table } from 'components/UI'
import s from './SkillsListModal.module.scss'

export const SkillsListModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { UIOptions } = useUIOptions()
  const { name: distName } = useParams()
  const { deleteDeployment } = useDeploy()
  const { getDist, changeVisibility } = useAssistants()
  const { getGroupComponents, clone } = useComponent()
  const navigate = useNavigate()
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

  const handleAdd = (skill: ISkill) => {
    toast.promise(
      clone.mutateAsync(
        { skill: skill, distName: distName!, type: 'skills' },
        {
          onSuccess: (skill: ISkill) => {
            bot?.deployment?.state === DEPLOY_STATUS.UP &&
              deleteDeployment.mutateAsync(bot).then(() => {
                // unpublish /
                const name = bot?.name!
                const visibility = VISIBILITY_STATUS.PRIVATE as TDistVisibility
                bot?.publish_state !== null &&
                  changeVisibility.mutateAsync({ name, visibility })
              })

            handleClose()
            navigate(
              generatePath(RoutesList.editor.skillEditor, {
                name: distName || '',
                skillId: (skill?.component_id ?? skill?.id)?.toString(),
              })
            )
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
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleClose={handleClose}
      modalClassName={s.modal}
      backdropClassName={cx(
        'backdrop',
        rightSidepanelIsActive && 'withRightSidePanel'
      )}
    >
      <div className={s.container}>
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
