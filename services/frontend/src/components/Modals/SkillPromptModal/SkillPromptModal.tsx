import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import React, { createRef, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { generatePath, useNavigate, useParams } from 'react-router'
import { RoutesList } from 'router/RoutesList'
import {
  IPromptBlock,
  ISkill,
  LM_Service,
  LanguageModel,
  TDistVisibility,
} from 'types/types'
import { DEPLOY_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import { serviceCompanyMap } from 'mapping/serviceCompanyMap'
import { toasts } from 'mapping/toasts'
import { getAllLMservices } from 'api/components'
import { useAssistants, useComponent, useDeploy } from 'hooks/api'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import { useObserver } from 'hooks/useObserver'
import { useQuitConfirmation } from 'hooks/useQuitConfirmation'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { getValidationSchema } from 'utils/getValidationSchema'
import sortByGroup from 'utils/sortByGroup'
import triggerSkillSidePanel from 'utils/triggerSkillSidePanel'
import { Button } from 'components/Buttons'
import { SkillDropboxSearch } from 'components/Dropdowns'
import { ResizerLine, SvgIcon } from 'components/Helpers'
import { PromptEditor } from 'components/Inputs'
import { PromptBlocksModule } from 'components/Modules'
import getFormattedPromptBlock from 'components/Modules/PromptBlocksModule/getFormattedPromptBlock'
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
  model: {
    id: string
    name: string
    display_name: string
    disabled: boolean
  }
  prompt: string
}

type PromptEditorHandle = React.ElementRef<typeof PromptEditor>

const SkillPromptModal = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { name: distName, skillId } = useParams()
  const { getComponent, updateComponent } = useComponent()
  const { deleteDeployment } = useDeploy()
  const { UIOptions, setUIOption } = useUIOptions()
  const { getDist, changeVisibility } = useAssistants()
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
  const validationSchema = getValidationSchema()
  const promptEditorRef = React.createRef<PromptEditorHandle>()
  const cx = classNames.bind(s)
  const { skillsPropsOpened } = useGaSkills()

  const language = bot?.language?.value!

  const { data: services } = useQuery(
    'lm_services',
    () => getAllLMservices(language),
    { enabled: Boolean(language), refetchOnWindowFocus: false }
  )

  const dropboxArray: any[] = sortByGroup(
    services?.map((service: LM_Service) => ({
      id: service?.id?.toString(),
      name: service?.name,
      display_name: service?.display_name,
      disabled: !service?.is_maintained,
      company_name: serviceCompanyMap?.[service?.name],
    })) || [],
    'company_name'
  )

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

  const promptBuildingBlocks = services?.find(
    ({ id }) => id.toString() === getValues().model?.id?.toString()
  )?.prompt_blocks

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
            const name = bot?.name!
            const newVisibility = VISIBILITY_STATUS.PRIVATE as TDistVisibility
            if (bot?.deployment?.state === DEPLOY_STATUS.UP) {
              deleteDeployment
                .mutateAsync(bot!)
                .then(
                  () =>
                    bot?.visibility !== VISIBILITY_STATUS.PRIVATE &&
                    changeVisibility.mutateAsync({ name, newVisibility })
                )
            } else return
          }),
        toasts().updateComponent
      )
      .then(() => trigger('RenewChat', {}))
  }

  const handlePropertiesClick = () => {
    skillsPropsOpened('skill_editor', skill)
    triggerSkillSidePanel({
      skill,
      distName: distName!,
      activeTab: 'properties',
    })
  }

  const handlePromptBlockSelect = (block: IPromptBlock) => {
    const formattedBlock = getFormattedPromptBlock({
      prompt: getValues('prompt'),
      block,
    })

    promptEditorRef?.current?.insertText(formattedBlock)
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
                label={t('modals.skill_prompt.service_dropbox.label')}
                name='model'
                control={control}
                rules={{ required: true }}
                selectedItemId={skill?.lm_service?.id?.toString()}
                props={{
                  placeholder: t(
                    'modals.skill_prompt.service_dropbox.placeholder'
                  ),
                }}
                list={dropboxArray}
                fullWidth
                fullHeight
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
              {promptBuildingBlocks && promptBuildingBlocks?.length > 0 && (
                <div className={cx('tabs', 'blocks')}>
                  <span className={cx('blocks-label')}>
                    {t('modals.skill_prompt.prompt_blocks')}
                  </span>
                  <PromptBlocksModule
                    blocks={promptBuildingBlocks}
                    handleSelect={handlePromptBlockSelect}
                  />
                </div>
              )}
              {skill?.prompt && (
                <PromptEditor
                  ref={promptEditorRef}
                  label={t('modals.skill_prompt.prompt_field.label')}
                  name='prompt'
                  placeholder={t(
                    'modals.skill_prompt.prompt_field.placeholder'
                  )}
                  defaultValue={skill?.prompt}
                  tokenizerModel={selectedModel?.name as LanguageModel}
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
                />
              )}
              {/* <TextArea
                label={t('modals.skill_prompt.prompt_field.label')}
                name='prompt'
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
                  placeholder: t(
                    'modals.skill_prompt.prompt_field.placeholder'
                  ),
                  id: 'prompt-textarea',
                }}
              /> */}
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
                {t('modals.skill_prompt.btns.save')}
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
