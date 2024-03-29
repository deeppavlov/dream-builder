import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { ISkill } from 'types/types'
import { DEPLOY_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants, useComponent, useDeploy } from 'hooks/api'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { useObserver } from 'hooks/useObserver'
import { getValidationSchema } from 'utils/getValidationSchema'
import { Button } from 'components/Buttons'
import { Input, TextArea } from 'components/Inputs'
import { BaseModal } from 'components/Modals'
import s from './SkillModal.module.scss'

type TSkillModalAction = 'create' | 'copy' | 'edit'

interface IParentSkillInfo extends Pick<ISkill, 'display_name' | 'name'> {}

interface SkillModalProps {
  action: TSkillModalAction
  skill?: ISkill
  parent?: IParentSkillInfo // The skill that we copy
}

export const SkillModal = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TSkillModalAction | null>(null)
  const [skill, setSkill] = useState<ISkill | null>(null)
  const { name: distName } = useParams()
  const { deleteDeployment } = useDeploy()
  const { getDist, changeVisibility } = useAssistants()
  const nav = useNavigate()
  const [NAME_ID, DESC_ID] = ['display_name', 'description']
  const validationSchema = getValidationSchema()
  const bot = distName ? getDist({ distName }).data : null
  const { vaChangeDeployState } = useGaAssistant()

  const { handleSubmit, control, reset, getValues } = useForm({ mode: 'all' })

  const descriptionMaxLenght = 500

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setSkill(null)
    reset()
  }

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = ({
    detail: { action, skill },
  }: {
    detail: SkillModalProps
  }) => {
    setAction(action ?? 'create')
    setSkill(skill ?? null)

    // Reset values and errors states
    reset({
      [NAME_ID]: skill?.display_name,
      [DESC_ID]: skill?.description,
    })
    setIsOpen(prev => !prev)
  }
  const { create, edit } = useComponent()

  const handleCreate = (data: any) => {
    !create.isLoading &&
      toast.promise(
        create.mutateAsync(
          { data, distName: distName || '', type: 'skills' },
          {
            onSuccess: skill => {
              closeModal()
              nav(
                generatePath(RoutesList.editor.skillEditor, {
                  name: distName || '',
                  skillId: (skill?.component_id ?? skill?.id)?.toString(),
                })
              )
              const newVisibility = VISIBILITY_STATUS.PRIVATE
              bot?.deployment?.state === DEPLOY_STATUS.UP &&
                deleteDeployment.mutateAsync(bot!).then(() => {
                  changeVisibility.mutateAsync({
                    name: bot?.name!,
                    newVisibility,
                    inEditor: true,
                  })
                  vaChangeDeployState('VA_Undeployed')
                })
            },
          }
        ),
        toasts().createComponent
      )
  }
  const handleEdit = (data: { display_name: string; description: string }) => {
    const isDist = distName && distName?.length > 0

    if (!skill) return
    if (!isDist) return console.log(`${skill?.name} rename: dist not found.`)

    const { component_id } = skill

    toast
      .promise(
        edit.mutateAsync({ data, component_id, distName, type: 'skills' }),
        toasts().renameComponent
      )
      .then(() => closeModal())
  }
  const onFormSubmit = (data: any) => {
    action === 'create' && handleCreate(data)
    action === 'edit' && handleEdit(data)
  }

  useObserver('SkillModal', handleEventUpdate)

  return (
    <BaseModal handleClose={closeModal} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.skillModal}>
        <div>
          {action == 'create' && (
            <h4>{t('modals.skill.create_from_scratch.header')}</h4>
          )}
          {action == 'edit' && <h4>{t('modals.skill.edit.header')}</h4>}
          <div className={s.distribution}>
            {action == 'create' && (
              <div>
                <Trans i18nKey='modals.skill.create_from_scratch.subheader' />
              </div>
            )}
            {action == 'edit' && (
              <div>
                {t('modals.skill.edit.subheader')}{' '}
                <mark>{skill?.display_name}</mark>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Input
            label={t('modals.skill.name_field.label')}
            name={NAME_ID}
            defaultValue={getValues()[NAME_ID]}
            control={control}
            rules={{
              pattern: validationSchema.globals.regExpPattern,
              required: validationSchema.globals.required,
            }}
            props={{
              placeholder: t('modals.skill.name_field.placeholder'),
            }}
          />
          <div className={s.textarea}>
            <TextArea
              label={t('modals.skill.desc_field.label')}
              name={DESC_ID}
              control={control}
              defaultValue={getValues()[DESC_ID]}
              withCounter
              rules={{
                maxLength:
                  validationSchema.globals.desc.maxLength(descriptionMaxLenght),
                pattern: validationSchema.globals.regExpPattern,
                required: validationSchema.globals.required,
              }}
              props={{
                placeholder: t('modals.skill.desc_field.placeholder'),
                rows: 6,
              }}
            />
          </div>
          <div className={s.btns}>
            <Button theme='secondary' props={{ onClick: closeModal }}>
              {t('modals.skill.btns.cancel')}
            </Button>
            <Button
              theme='primary'
              props={{ type: 'submit', disabled: create.isLoading }}
            >
              {action == 'create' && t('modals.skill.btns.create')}
              {action == 'edit' && t('modals.skill.btns.save')}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}
