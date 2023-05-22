import { RouteObject } from 'react-router-dom'

export interface UserInterface {
  name: string
  email: string
  picture: string
}

export interface UserContext {
  user: UserInterface | null
}

export interface ITokens {
  refresh_token: string
  token: string
}

export interface IAPIToken {
  id: number
  name: string
  description: string
  base_url: string
}

export interface IPostUserToken {
  user_id: number
  api_token_id: number
  token_value: string
}

export interface IPreviewContext {
  isPreview: boolean
  setIsPreview: (isPreview: boolean) => void
}

export interface IAuthor {
  email: string
  family_name: string
  fullname: string
  given_name: string
  id: number
  picture: string
  sub: string
}

export type TEvents =
  | 'TRIGGER_RIGHT_SP_EVENT'
  | 'ShareModal'
  | 'SignInModal'
  | 'AreYouSureModal'
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
  | 'ConfirmApiTokenUpdate'

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
}

export interface BotCardProps {
  type: BotAvailabilityType
  bot: BotInfoInterface
  size?: BotCardSize
  disabled: boolean
}

export interface IComponent {
  name: string
  display_name: string
  author: string
  component_type: ComponentType
  model_type: ModelType
  description: string
  date_created: string | Date | number
  execution_time: string | number | null
  gpu_usage: string | number | null
  ram_usage: string | number | null
  is_customizable: boolean
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
export interface IAnnotator {
  name: string
  author: string
  authorImg: string
  type: string
  desc: string
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

export interface SkillListProps {
  skills: ISkill[]
  view: ViewType
  type?: SkillAvailabilityType
  size?: SkillCardSize
  forGrid?: boolean
  forModal?: boolean
  withoutDate?: boolean
  handleAdd?: (skill: ICreateComponent) => void
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
  ram_usage: string
  gpu_usage: string
  execution_time: string
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
  api_key: string | null
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

export type Message = { message: string }
export type ChatPanelType = 'bot' | 'skill'
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

export type PostDistParams = {
  display_name: string
  description: string
}

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

export type BotVisabilityType = 'Public' | 'Unlisted'

export type TTopbar = 'main' | 'editor'

export type LanguageModel =
  | 'ChatGPT'
  | 'GPT-3.5'
  | 'Open-Assistant SFT-1 12B'
  | 'GPT-J 6B'

export type AssistantFormValues = { display_name: string; description: string }

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

export interface IEditComponent {
  display_name: string
  description: string
}

export type TComponents = {
  [key in StackType]: IStackElement[]
}

export interface IBeforeLoginModal {
  name: string
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
