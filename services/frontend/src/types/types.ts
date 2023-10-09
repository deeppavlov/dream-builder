import { RouteObject } from 'react-router-dom'

export interface UserInterface {
  name: string
  email: string
  picture: string
  family_name: string
  given_name: string
  id: number
  refresh_token: string
  sub: string
  token: string
}

export interface UserContext {
  user: UserInterface | null
}

export interface ITokens {
  refresh_token: string
  token: string
}

export interface IPreviewContext {
  isPreview: boolean
  setIsPreview: (isPreview: boolean) => void
}

export interface IAuthor {
  id: number
  email: string
  name: string
  picture: string
  outer_id: string
  role: {
    id: number
    name: string
    can_set_roles: boolean
    can_confirm_publish: boolean
    can_view_private_assistants: boolean
  }
}

export type TEvents =
  | 'TRIGGER_RIGHT_SP_EVENT'
  | 'ShareAssistantModal'
  | 'SignInModal'
  | 'RenewChat'
  | 'AssistantModal'
  | 'ChooseBotModal'
  | 'DeleteAssistantModal'
  | 'DeployNotificationModal'
  | 'IntentCatcherModal'
  | 'IntentResponderModal'
  | 'PublicToPrivateModal'
  | 'Modal'
  | 'PublishAssistantModal'
  | 'SkillModal'
  | 'SkillPromptModal'
  | 'SkillQuitModal'
  | 'SkillsListModal'
  | 'CreateGenerativeSkillModal'
  | 'CreateSkillDistModal'
  | 'DeleteSkillModal'
  | 'FreezeSkillModal'
  | 'ConfirmApiTokenUpdateModal'
  | 'AccessTokensModal'
  | 'AccessTokensChanged'
  | 'PublishWarningModal'
  | 'ProfileSettingsModal'
  | 'CtxMenuBtnClick'
  | 'ChangeLanguageModal'
  | 'AssistantDeleted'

export type TDistVisibility = 'UNLISTED_LINK' | 'PRIVATE' | 'PUBLIC_TEMPLATE'

export type TDeploymentState =
  | null
  | 'STARTED'
  | 'CREATING_CONFIG_FILES'
  | 'BUILDING_IMAGE'
  | 'PUSHING_IMAGES'
  | 'DEPLOYING_STACK'
  | 'DEPLOYED'
  | 'UP'

export interface IDeployment {
  chat_host: string
  chat_port: number
  date_created: string
  date_state_updated: any
  id: number
  state: TDeploymentState
  error: {
    state: string
    message: string
    exception: string
  }
}
export interface IDeploymentStatus extends IDeployment {
  virtual_assistant: BotInfoInterface
}
type TKey = {
  base_url: string
  description: string
  display_name: string
  id: number
  name: string
}

export interface BotInfoInterface {
  id: number
  name: string
  display_name: string
  author: IAuthor
  description: string
  date_created: string
  ram_usage: string
  gpu_usage: string
  disk_usage: string
  visibility: TDistVisibility
  publish_state: null | 'APPROVED' | 'IN_REVIEW' | 'REJECTED'
  deployment: IDeployment
  required_api_keys: TKey[] | null
  language?: { id: number; value: ELOCALES_KEY }
  cloned_from_id: number | null
}

export interface BotCardProps {
  type: BotAvailabilityType
  bot: BotInfoInterface
  size?: BotCardSize
  disabled: boolean
}

export interface ResourcesInterface {
  ram: string
  gpu: string
  space: string
}

export interface TotalResourcesInterface {
  proxy: { containers: string } & ResourcesInterface
  custom?: { containers: string } & ResourcesInterface
}

export interface SettingKey {
  name: string
  type: 'switch' | 'checkbox' | 'radio' | 'input'
  value?: any
  checked?: boolean
}

export interface IContextMenu {
  isPreview: boolean
  isCustomizable: boolean
}

export interface DistListProps {
  view: ViewType
  dists: BotInfoInterface[]
  type: BotAvailabilityType
  size?: BotCardSize
}

export interface ICreateComponent {
  display_name: string
  description: string
  lm_service_id?: number
  prompt?: string
}

export interface ICloneComponent {
  skill: ISkill
  distName: string
  type: StackType
}

export interface SkillListProps {
  skills: ISkill[]
  view: ViewType
  type?: SkillAvailabilityType
  size?: SkillCardSize
  forGrid?: boolean
  forModal?: boolean
  withoutDate?: boolean
  handleAdd?: (skill: ISkill) => void
}
export interface SettingKey {
  name: string
  type: 'switch' | 'checkbox' | 'radio' | 'input'
  value?: any
  checked?: boolean
}

export interface IContextMenu {
  isPreview: boolean
}

export interface IStackElement {
  id: number
  component_id: number
  name: string // Routing name
  display_name: string
  author: IAuthor
  component_type: ComponentType | null
  model_type: ModelType | null
  date_created: string | Date
  description: string
  is_customizable: boolean
}

export interface LM_Service {
  id: number
  name: string
  display_name: string
  size: string
  gpu_usage: string
  max_tokens: number
  description: string
  project_url: string
  api_key: TKey | null
  is_maintained: boolean
  company_name?: string
  prompt_blocks?: IPromptBlock[]
  languages?: { id: number; value: ELOCALES_KEY }[]
}

export interface ISkill extends IStackElement {
  prompt?: string
  lm_service?: LM_Service
}

export interface SessionConfig {
  id: number
  is_active: boolean
  user_id: boolean
  virtual_assistant_id: number
}

export type ChatHistory = {
  active_skill?: ISkill
  text: string
  author: 'bot' | 'me'
  hidden?: boolean
}

export type SkillCardSize = BotCardSize

export type CustomRouteConfig = RouteObject & { crumb?: string }

export type CustomEventName = string

export type CustomEventListener = (data: any) => void

export type BotAvailabilityType = 'public' | 'your'

export type SkillAvailabilityType = 'public' | 'your'

export type ViewType = 'cards' | 'table'

export type BotCardSize = 'big' | 'small'

export type ModelType = 'dictionary' | 'ml_based' | 'nn_based' | 'external'

export type ChatForm = { message: string }

export type ComponentType =
  | 'fallback'
  | 'retrieval'
  | 'Generative'
  | 'q_a'
  | 'script'
  | 'script_with_nns'

export type StackType =
  | 'annotators'
  | 'candidate_annotators'
  | 'response_annotators'
  | 'response_selectors'
  | 'skill_selectors'
  | 'skills'

export type TTopbar = 'main' | 'editor'

export type LanguageModel =
  | 'ChatGPT'
  | 'GPT-3.5'
  | 'Open-Assistant SFT-1 12B'
  | 'GPT-J 6B'
  | 'transformers-lm-oasst12b-2m'
  | 'transformers-lm-oasst12b'
  | 'transformers-lm-gptjt'
  | 'openai-api-gpt4-32k'
  | 'openai-api-gpt4'
  | 'openai-api-chatgpt'
  | 'openai-api-davinci3'
  | 'openai-api-chatgpt-16k'
  | 'anthropic-api-claude-v1'
  | 'anthropic-api-claude-instant-v1'

export type TLang = 'Russian' | 'English'

export type Visibility = 'PUBLIC_TEMPLATE' | 'PRIVATE' | 'UNLISTED_LINK' | null

export interface IApiService {
  base_url: string
  description: string
  id: number
  display_name: string
  name: string
}

export interface IUserApiKey {
  api_service: IApiService
  token_value: string
}

export interface IPostChat {
  hidden?: boolean
  dialog_session_id: number
  text: string
  prompt?: string
  lm_service_id?: number
  openai_api_key?: string
}

export type TComponents = {
  [key in StackType]: IStackElement[]
}

export interface IBeforeLoginModal {
  name: TEvents
  options: { [x: string]: any }
}

export type TDialogError =
  | 'lm-service'
  | 'prompt'
  | 'api-key'
  | 'dist-name'
  | 'deploy'
  | 'chat'
  | null

export interface IDialogError {
  type: TDialogError
  msg: string
}
export interface RequestProps {
  cardClickHandler: () => void
  r: IPublicationRequest
  confirm: any
  decline: any
  handleApprove: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void
  handleDecline: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void
}
export interface IDeploymentState extends IDeployment {
  virtual_assistant: BotInfoInterface
}

export interface IPublicationRequest {
  date_created: string
  date_reviewed: string
  id: number
  is_confirmed: boolean | null
  reviewed_by_user: string | null
  slug: string
  user: IAuthor
  virtual_assistant: BotInfoInterface
  visibility: 'PUBLIC_TEMPLATE' | 'PRIVATE' | 'UNLISTED_LINK'
}

export type TErrorStatus = 401 | 404 | 500 | 503
export type TErrorBoundary = {
  status: TErrorStatus
  message: string
}
export type TIntegrationTabType = 'CHAT' | 'API'
export type TApiCallType = 'CURL' | 'NODE' | 'PYTHON'
export enum API_CALL_TAB {
  CURL = 'CURL',
  NODE = 'NODE',
  PYTHON = 'PYTHON',
}
export interface IPromptBlock {
  category: string | null
  description: string
  display_name: string
  example: string
  id: number
  newline_after: boolean
  newline_before: boolean
  template: string
}

export enum ELOCALES_KEY {
  en = 'en',
  ru = 'ru',
}
export enum ELOCALES_TITLE {
  EN = 'EN',
  RU = 'RU',
}
export type TLocales = {
  [key in ELOCALES_KEY]: { title: ELOCALES_TITLE }
}

export interface IRouterCrumb {
  params: any
  ui: any
  t: any // i18n translation
}

export type TLocale = 'ru' | 'en'

export interface IGaOptions {
  [key: string]: string | boolean | BotInfoInterface | ISkill | undefined
  assistant?: BotInfoInterface
  skill?: ISkill
}

export interface IGaContext {
  gaState: IGaOptions
  setGaState: React.Dispatch<React.SetStateAction<IGaOptions>>
}

export type PageType =
  | 'all_va_page'
  | 'allbots'
  | 'yourbots'
  | 'admin_panel'
  | 'va_skillset_page'
  | 'va_template_skillset_page'
  | 'va_skill_editor'
