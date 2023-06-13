import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { generatePath, useNavigate, useParams } from 'react-router'
import { RoutesList } from 'router/RoutesList'
import { ISkill, LM_Service } from 'types/types'
import { DEPLOY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { getAllLMservices } from 'api/components'
import { useAssistants, useComponent, useDeploy } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { useQuitConfirmation } from 'hooks/useQuitConfirmation'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { validationSchema } from 'utils/validationSchema'
import { Button } from 'components/Buttons'
import { Accordion, SkillDropboxSearch } from 'components/Dropdowns'
import { TextArea } from 'components/Inputs'
import { SkillDialog } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Modal, Wrapper } from 'components/UI'
import { HELPER_TAB_ID } from 'components/Widgets/Sidebar/DeepyHelperTab'
import s from './SkillPromptModal.module.scss'

interface ITriggerProps {
  skill?: ISkill
  isOpen?: boolean
}

interface IFormValues {
  model: { id: string; name: string; disabled: boolean }
  prompt: string
}

const SkillPromptModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { name: distName, skillId } = useParams()
  const { getComponent, updateComponent } = useComponent()
  const { deleteDeployment } = useDeploy()
  const { UIOptions, setUIOption } = useUIOptions()
  const { getDist } = useAssistants()
  const nav = useNavigate()
  const isUrlParams = distName && skillId
  const skill = isUrlParams
    ? getComponent({ distName, id: parseInt(skillId), type: 'skills' })?.data
    : null
  const bot = distName ? getDist({ distName }).data : null
  const [selectedModel, setSelectedModel] = useState<LM_Service | null>(null)
  const modalRef = useRef(null)
  const leftSidePanelIsActive = UIOptions[consts.LEFT_SP_IS_ACTIVE]
  const cx = classNames.bind(s)

  const { data: services } = useQuery('lm_services', getAllLMservices, {
    refetchOnWindowFocus: false,
  })

  const dropboxArray =
    services?.map((service: LM_Service) => ({
      id: service?.id?.toString(),
      name: service?.display_name,
      disabled: !service?.is_maintained,
    })) || []

  const {
    handleSubmit,
    reset,
    trigger: triggerField,
    getValues,
    control,
    watch,
    formState: { dirtyFields, isSubmitting, isDirty },
  } = useForm<IFormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { model: skill?.lm_service, prompt: skill?.prompt },
  })

  const clearStates = () => {
    setIsOpen(false)
    nav(generatePath(RoutesList.editor.skills, { name: distName || '' }))
  }

  const closeModal = (continueExit?: Function) => {
    if (isDirty)
      return trigger('SkillQuitModal', {
        handleQuit: () => {
          if (continueExit) return continueExit()
          clearStates()
        },
      })
    clearStates()
  }

  const handleEventUpdate = (data: { detail: ITriggerProps }) => {
    const isRequestToClose =
      data.detail.isOpen !== undefined && !data.detail.isOpen

    if (isRequestToClose) return setIsOpen(false)
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
    setIsOpen(prev => {
      if (data.detail.isOpen && prev) return prev
      return !prev
    })
  }

  const handleSave = ({ prompt, model }: IFormValues) => {
    const isSkill = skill !== undefined && skill !== null
    const isModel = selectedModel !== undefined && selectedModel !== null

    if (!isSkill || !isModel) return

    const { component_id, id, description, display_name } = skill

    toast
      .promise(
        updateComponent
          .mutateAsync({
            component_id: component_id ?? id,
            description,
            display_name,
            lm_service_id: selectedModel?.id!,
            lm_service: selectedModel, // FIX IT!
            prompt: prompt,
            distName: distName || '',
            type: 'skills',
          })
          .then(() => {
            if (bot?.deployment?.state === DEPLOY_STATUS.UP) {
              deleteDeployment.mutateAsync(bot!)
            } else return
          }),
        toasts.updateComponent
      )
      .then(() => trigger('RenewChat', {}))
  }

  const onFormSubmit = (data: IFormValues) => {
    const isDirty = Boolean(dirtyFields?.model || dirtyFields?.prompt)
    if (isDirty) handleSave(data)
  }

  useObserver('SkillPromptModal', handleEventUpdate)

  // Update selected LM for TextArea tokenizer
  useEffect(() => {
    if (!isOpen) return
    const selectedService = services?.find(
      ({ id }) => id.toString() === getValues().model?.id?.toString()
    )
    setSelectedModel(selectedService ?? null)
  }, [watch(['model']), isOpen])

  useEffect(() => {}, [watch(['prompt'])])

  useEffect(() => {
    const { EDITOR_ACTIVE_SKILL } = consts

    if (isOpen)
      reset(
        {
          model: {
            id: skill?.lm_service?.id?.toString(),
            name: skill?.lm_service?.display_name,
            disabled: false,
          },
          prompt: skill?.prompt,
        },
        { keepDirty: false }
      )

    setUIOption({ name: EDITOR_ACTIVE_SKILL, value: isOpen ? skill : null })

    return () => {
      setUIOption({ name: EDITOR_ACTIVE_SKILL, value: null })
      reset({})
    }
  }, [skill, isOpen])

  useQuitConfirmation({
    activeElement: modalRef,
    availableSelectors: [
      `#${HELPER_TAB_ID}`,
      '#sp_left',
      '#testDialog',
      '#assistantDialogPanel',
      '#accessTokensModal',
      '#settingsTab',
    ],
    isActive: isOpen && isDirty,
    quitHandler: closeModal,
  })

  return (
    <Modal
      isOpen={isOpen}
      backdropClassName={s.backdrop}
      modalClassName={cx(
        'skillPromptModal',
        leftSidePanelIsActive && 'withSidePanel'
      )}
      modalRef={modalRef}
      closeOnBackdropClick={false}
    >
      <Wrapper closable onClose={() => closeModal()}>
        <div className={s.container}>
          <form onSubmit={handleSubmit(onFormSubmit)} className={cx('editor')}>
            <div className={s.header}>
              {skill?.display_name ?? 'Current Skill'}: Editor
            </div>
            <div className={s['editor-container']}>
              <div className={s.top}>
                <SkillDropboxSearch
                  name='model'
                  label='Choose model:'
                  control={control}
                  rules={{ required: true }}
                  selectedItemId={skill?.lm_service?.id?.toString()}
                  props={{ placeholder: 'Choose model' }}
                  list={dropboxArray}
                  fullWidth
                  withoutSearch
                />
                {selectedModel && (
                  <Accordion title='Model Details:' type='description' isActive>
                    <p className={s.tip}>
                      <span>{selectedModel?.description}</span>
                      <a
                        href={selectedModel?.project_url}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {selectedModel?.project_url}
                      </a>
                    </p>
                  </Accordion>
                )}
              </div>
              <TextArea
                name='prompt'
                label='Enter prompt:'
                tokenizerModel={selectedModel?.display_name as any}
                defaultValue={skill?.prompt}
                countType='tokenizer'
                withCounter
                fullHeight
                resizable={false}
                control={control}
                rules={{
                  required: validationSchema.global.required,
                  maxLength:
                    selectedModel?.max_tokens &&
                    validationSchema.skill.prompt.maxLength(
                      selectedModel?.max_tokens
                    ),
                }}
                triggerField={triggerField}
                props={{
                  placeholder:
                    "Hello, I'm a SpaceX Starman made by brilliant engineering team at SpaceX to tell you about the future of humanity in space",
                }}
              />
            </div>
            <div className={s.bottom}>
              <div className={s.btns}>
                <Button
                  theme='primary'
                  props={{
                    type: 'submit',
                    disabled:
                      updateComponent.isLoading || isSubmitting || !isDirty,
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </form>

          <div className={s.dialog}>
            <SkillDialog isDebug distName={distName} skill={skill} />
          </div>
        </div>
      </Wrapper>
    </Modal>
  )
}

export default SkillPromptModal
