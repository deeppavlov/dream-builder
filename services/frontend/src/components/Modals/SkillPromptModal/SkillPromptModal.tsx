import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { createRef, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { generatePath, useNavigate, useParams } from 'react-router'
import { RoutesList } from 'router/RoutesList'
import { IPromptBlock, ISkill, LM_Service } from 'types/types'
import { DEPLOY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { getAllLMservices } from 'api/components'
import { useAssistants, useComponent, useDeploy } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { useQuitConfirmation } from 'hooks/useQuitConfirmation'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import triggerSkillSidePanel from 'utils/triggerSkillSidePanel'
import { validationSchema } from 'utils/validationSchema'
import { Button } from 'components/Buttons'
import { SkillDropboxSearch } from 'components/Dropdowns'
import { ResizerLine, SvgIcon } from 'components/Helpers'
import { TextArea } from 'components/Inputs'
import { PromptBlocksModule } from 'components/Modules'
import getFormattedPrompt from 'components/Modules/PromptBlocksModule/getFormattedPrompt'
import { SkillDialog } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Modal, Wrapper } from 'components/UI'
import { HELPER_TAB_ID } from 'components/Widgets/Sidebar/DeepyHelperTab'
import s from './SkillPromptModal.module.scss'
import promptBlocksJson from './promptBuildingBlocks.json'

interface ITriggerProps {
  skill?: ISkill
  isOpen?: boolean
}

interface IFormValues {
  model: {
    id: string
    name: string
    display_name: string
    disabled: boolean
  }
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
  const editorRef = createRef()
  const leftSidePanelIsActive = UIOptions[consts.LEFT_SP_IS_ACTIVE]
  const promptBuildingBlocks = (
    JSON.parse(JSON.stringify(promptBlocksJson)) as IPromptBlock[]
  )?.filter(block => block[selectedModel?.display_name])
  const cx = classNames.bind(s)

  const { data: services } = useQuery('lm_services', getAllLMservices, {
    refetchOnWindowFocus: false,
  })

  const dropboxArray =
    services?.map((service: LM_Service) => ({
      id: service?.id?.toString(),
      name: service?.name,
      display_name: service?.display_name,
      disabled: !service?.is_maintained,
    })) || []

  const {
    handleSubmit,
    reset,
    trigger: triggerField,
    getValues,
    setValue,
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

  const handlePropertiesClick = () => {
    triggerSkillSidePanel({
      skill,
      distName: distName!,
      activeTab: 'Properties',
    })
  }

  const handlePromptBlockSelect = async (block: IPromptBlock) => {
    await new Promise(resolve => {
      setValue(
        'prompt',
        getFormattedPrompt({ prompt: getValues('prompt'), block }),
        { shouldDirty: true, shouldValidate: true }
      )
      resolve(true)
    }).then(() => {
      const textareaEl = document.querySelector('#prompt-textarea')

      if (!textareaEl) return
      textareaEl.scrollTop = textareaEl?.scrollHeight
    })
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
            name: skill?.lm_service?.name,
            display_name: skill?.lm_service?.display_name,
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
      '#base_sp_close_btn',
      '#testDialog',
      '#skill_sp',
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
      <Wrapper>
        <div className={s.container}>
          <form onSubmit={handleSubmit(onFormSubmit)} className={s.editor}>
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
              <Button
                withIcon
                theme='tertiary2'
                props={{ onClick: handlePropertiesClick }}
              >
                <SvgIcon iconName='properties' />
              </Button>
            </div>
            <div className={s.middle}>
              {promptBuildingBlocks?.length > 0 && (
                <div className={cx('tabs', 'blocks')}>
                  <span className={cx('blocks-label')}>Prompt blocks:</span>
                  <PromptBlocksModule
                    blocks={promptBuildingBlocks}
                    handleSelect={handlePromptBlockSelect}
                  />
                </div>
              )}
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
                  placeholder: 'Pick words you might use',
                  id: 'prompt-textarea',
                }}
                highlights={[
                  { keyword: 'Act as', color: '#FFE9E4' },
                  { keyword: 'YOUR PERSONALITY', color: '##FFF1E4' },
                  { keyword: 'TASK', color: '#FFFCE4' },
                  { keyword: 'CONTEXT ABOUT HUMAN', color: '#E9FFE4' },
                  { keyword: 'INSTRUCTION', color: '#E4FEFF' },
                  { keyword: 'EXAMPLE', color: '#E4FEFF' },
                ]}
              />
            </div>
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
          </form>
          <div className={s.resizer}>
            <ResizerLine resizableElementRef={editorRef} />
          </div>
          <SkillDialog
            isDebug
            distName={distName}
            skill={skill}
            ref={editorRef}
          />
        </div>
        <button className={s.close} type='button' onClick={() => closeModal()}>
          <SvgIcon iconName='close' />
        </button>
      </Wrapper>
    </Modal>
  )
}

export default SkillPromptModal
