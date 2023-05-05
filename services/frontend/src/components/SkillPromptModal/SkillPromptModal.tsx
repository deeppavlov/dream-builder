import { ReactComponent as HistoryIcon } from '@assets/icons/history.svg'
import classNames from 'classnames/bind'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import Modal from 'react-modal'
import { useMutation, useQuery } from 'react-query'
import { generatePath, useNavigate, useParams } from 'react-router'
import { useDisplay } from '../../context/DisplayContext'
import { useComponent } from '../../hooks/useComponent'
import { useObserver } from '../../hooks/useObserver'
import { useQuitConfirmation } from '../../hooks/useQuitConfirmation'
import { RoutesList } from '../../router/RoutesList'
import { getAllLMservices } from '../../services/getAllLMservices'
import { ISkill, LM_Service } from '../../types/types'
import { Accordion } from '../../ui/Accordion/Accordion'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'
import { validationSchema } from '../../utils/validationSchema'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { HELPER_TAB_ID } from '../Sidebar/components/DeepyHelperTab'
import SkillDialog from '../SkillDialog/SkillDialog'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './SkillPromptModal.module.scss'

interface Props {
  skill?: ISkill
  isOpen?: boolean
}

interface FormValues {
  model: string
  prompt: string
}

const SkillPromptModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { name: distName, skillId } = useParams()
  const { getAllComponents, updateComponent } = useComponent()
  const skill = distName
    ? (getAllComponents(distName).data?.skills?.find(
        s => s.name === skillId
      ) as ISkill)
    : null
  const [selectedService, setSelectedService] = useState<LM_Service | null>(
    null
  )
  const { options, dispatch } = useDisplay()
  const leftSidePanelIsActive = options.get(consts.LEFT_SP_IS_ACTIVE)
  const modalRef = useRef(null)
  const nav = useNavigate()
  const cx = classNames.bind(s)

  const { data: services } = useQuery('lm_services', getAllLMservices, {
    refetchOnWindowFocus: false,
  })

  const createMap = (array: LM_Service[]) => {
    const map = new Map<string, LM_Service>()
    array?.forEach((object: LM_Service) => {
      const { display_name } = object
      map.set(display_name, { ...object })
    })
    return map
  }

  const servicesList = createMap(services)
  const dropboxArray =
    services
      ?.map((service: LM_Service) => ({
        id: service?.name,
        name: service?.display_name,
      }))
      ?.concat([
        {
          id: 'rmt_with_2m_tokens',
          name: 'Open-Assistant SFT-1 12B RMT (with 2M tokens)',
          disabled: true,
        },
      ]) || []

  // const { data: conf } = useQuery(
  //   ['conf', skill?.component_id],
  //   () => getGenerativeConf(skill?.component_id as number),
  //   {
  //     refetchOnWindowFocus: false,
  //     enabled: skill?.component_id !== undefined,
  //   }
  // )

  const {
    handleSubmit,
    reset,
    setError,
    getValues,
    control,
    watch,
    formState: { dirtyFields, errors },
  } = useForm<FormValues>({
    // mode: 'all',
    defaultValues: {
      model: skill?.lm_service?.display_name,
      prompt: skill?.prompt,
    },
  })
  const model = getValues().model
  const skillModelTip = servicesList.get(model)?.description
  const skillModelLink = servicesList.get(model)?.project_url
  const isDirty = Object.values(dirtyFields).length > 0

  const clearStates = () => {
    setIsOpen(false)
    // setSkill(null)
    nav(generatePath(RoutesList.editor.default, { name: distName || '' }))
  }

  const closeModal = () => {
    if (isDirty) return trigger('SkillQuitModal', { handleQuit: clearStates })
    clearStates()
  }

  const handleEventUpdate = (data: { detail: Props }) => {
    const { skill } = data.detail
    const isRequestToClose =
      data.detail.isOpen !== undefined && !data.detail.isOpen

    if (isRequestToClose) {
      setIsOpen(false)
      // setSkill(null)
      return
    }

    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
    // setSkill(skill ?? null)
    // reset(
    //   {
    //     model: skill?.lm_service?.display_name,
    //     prompt: skill?.prompt,
    //   },
    //   { keepDirty: false }
    // )

    setIsOpen(prev => {
      if (data.detail.isOpen && prev) return prev
      return !prev
    })
  }

  const handleSave = async (data: FormValues) => {
    toast
      .promise(update.mutateAsync(data), {
        loading: 'Saving...',
        success: 'Success!',
        error: 'Something Went Wrong...',
      })
      .finally(() => trigger('RenewChat', {}))
  }

  const onFormSubmit = (data: FormValues) => {
    if (isDirty) handleSave(data)
  }

  const postServiceAndPrompt = async ({ prompt, model }: FormValues) => {
    const service = servicesList.get(model)?.id

    if (skill === undefined || skill === null) return

    const { component_id, description, display_name } = skill

    await updateComponent.mutateAsync({
      component_id,
      description,
      display_name,
      lm_service_id: service!,
      lm_service: services?.find(s => s.id === service), // FIX IT!
      prompt: prompt,
      distName: distName || '',
      type: 'skills',
    })
  }

  const update = useMutation({
    mutationFn: (data: FormValues) => postServiceAndPrompt(data),
  })

  useObserver('SkillPromptModal', handleEventUpdate)

  // Update selected LM for TextArea tokenizer
  useEffect(() => {
    setSelectedService(
      services?.find((s: LM_Service) => s?.display_name === model)
    )
  }, [watch(['model'])])

  useEffect(() => {
    reset(
      {
        // model: skill?.lm_service?.display_name,
        model: getValues().model,
        prompt: skill?.prompt,
      }
      // { keepDirty: false }
    )
  }, [skill])

  useEffect(() => {
    dispatch({
      type: 'set',
      option: {
        id: consts.EDITOR_ACTIVE_SKILL,
        value: isOpen ? skill : null,
      },
    })
    // return () => reset({})
  }, [isOpen])

  useQuitConfirmation({
    activeElement: modalRef,
    availableSelectors: [`#${HELPER_TAB_ID}`, `#sp_left`],
    isActive: isOpen && isDirty,
    quitHandler: closeModal,
  })

  return (
    <Modal
      isOpen={isOpen}
      style={{
        overlay: {
          top: 64,
          right: 0,
          left: 80,
          position: 'fixed',
          background: 'transparent',
          zIndex: 0,
        },
        content: {
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          transform: 'none',
          height: '100%',
          width: '100%',
          border: 'none',
          background: 'none',
          borderRadius: 0,
          padding: 0,
        },
      }}
    >
      <div
        className={cx(
          'skillPromptModal',
          leftSidePanelIsActive && 'withSidePanel'
        )}
        ref={modalRef}
      >
        <Wrapper closable onClose={closeModal}>
          <div className={s.container}>
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className={cx('editor')}
            >
              <div className={s.header}>
                {skill?.display_name ?? 'Current Skill'}: Editor
              </div>
              <div className={s['editor-container']}>
                <div className={s.top}>
                  <SkillDropboxSearch
                    name='model'
                    control={control}
                    rules={{ required: true }}
                    defaultValue={skill?.lm_service?.display_name}
                    label='Choose model:'
                    list={dropboxArray}
                    props={{ placeholder: 'Choose model' }}
                    fullWidth
                  />
                  {skill?.lm_service?.display_name && (
                    <div>
                      <Accordion
                        title='Model Details:'
                        type='description'
                        isActive
                      >
                        <p className={s.tip}>
                          <span>{skillModelTip}</span>
                          <a
                            href={skillModelLink}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {skillModelLink}
                          </a>
                        </p>
                      </Accordion>
                    </div>
                  )}
                </div>
                <TextArea
                  name='prompt'
                  label='Enter prompt:'
                  countType='tokenizer'
                  tokenizerModel={selectedService?.display_name as any}
                  defaultValue={skill?.prompt}
                  withCounter
                  fullHeight
                  resizable={false}
                  control={control}
                  rules={{
                    required: validationSchema.global.required,
                    maxLength:
                      selectedService?.max_tokens &&
                      validationSchema.skill.prompt.maxLength(
                        selectedService?.max_tokens
                      ),
                  }}
                  setError={setError}
                  props={{
                    placeholder:
                      "Hello, I'm a SpaceX Starman made by brilliant engineering team at SpaceX to tell you about the future of humanity in space and",
                  }}
                />
              </div>
              <div className={s.bottom}>
                <div className={s.btns}>
                  <Button theme='tertiary-round' props={{ disabled: true }}>
                    <HistoryIcon />
                    History
                  </Button>
                  <Button
                    theme='primary'
                    props={{ type: 'submit', disabled: update.isLoading }}
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
      </div>
    </Modal>
  )
}

export default SkillPromptModal
