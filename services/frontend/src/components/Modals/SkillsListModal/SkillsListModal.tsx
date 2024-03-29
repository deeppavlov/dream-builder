import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { generatePath } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { ISkill, TDistVisibility } from 'types/types'
import { DEPLOY_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants, useComponent, useDeploy } from 'hooks/api'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
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
  const { t } = useTranslation()
  const { name: distName } = useParams()
  const { deleteDeployment } = useDeploy()
  const { getDist, changeVisibility } = useAssistants()
  const { getGroupComponents, clone } = useComponent()
  const navigate = useNavigate()
  const { skillAdded } = useGaSkills()
  const { vaChangeDeployState } = useGaAssistant()
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

  const cx = classNames.bind(s)

  const handleClose = () => {
    setIsOpen(false)
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }

  const handleOk = () => handleClose()

  const handleAdd = (template: ISkill) => {
    !clone.isLoading &&
      toast.promise(
        clone.mutateAsync(
          { skill: template, distName: distName!, type: 'skills' },
          {
            onSuccess: (skill: ISkill) => {
              bot?.deployment?.state === DEPLOY_STATUS.UP &&
                deleteDeployment.mutateAsync(bot).then(() => {
                  // unpublish /
                  const name = bot?.name!
                  changeVisibility.mutateAsync({
                    name,
                    newVisibility: VISIBILITY_STATUS.PRIVATE,
                    inEditor: true,
                  })
                  vaChangeDeployState('VA_Undeployed')
                })

              skillAdded(skill, template)

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
        toasts().addComponent
      )
  }

  const handleEventUpdate = () => setIsOpen(true)

  useObserver('SkillsListModal', handleEventUpdate)

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleClose={handleClose}
      modalClassName={cx(
        'modal',
        rightSidepanelIsActive && 'withRightSidePanel'
      )}
      backdropClassName={s.backdrop}
    >
      <div className={s.container}>
        <div className={s.header}>{t('modals.choose_skill.header')}</div>

        <Table
          headers={[
            t('skill_table.name'),
            t('skill_table.type'),
            t('skill_table.desc'),
            ...(rightSidepanelIsActive ? [] : [t('skill_table.created')]),
            t('skill_table.actions'),
          ]}
          addButton={
            <AddButton
              forTable
              fromScratch
              forSkills
              onAddRequest={handleClose}
            />
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
            {t('modals.choose_skill.btns.ok')}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
