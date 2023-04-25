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

export interface BotInfoInterface {
  name: string
  display_name: string
  author: IAuthor
  description: string
  date_created: string
  ram_usage: string
  gpu_usage: string
  disk_usage: string
}

export interface BotCardProps {
  type: BotAvailabilityType
  bot: BotInfoInterface
  size?: BotCardSize
  disabled: boolean
}

export interface Component {
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
export interface SkillListProps {
  skills: ISkill[]
  view: ViewType
  type?: SkillAvailabilityType
  size?: SkillCardSize
  forGrid?: boolean
  forModal?: boolean
  withoutDate?: boolean
  addFunc?: (distName: string, id: number) => void
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

export interface ISkill extends IStackElement {
  model?: string
  prompt?: string
  lm_service: string
  id: number
  component_id?: number
}

export interface SessionConfig {
  id: number
  is_active: boolean
  user_id: boolean
  virtual_assistant_id: number
}

export interface SkillDialogProps {
  error?: boolean
  debug: boolean
  chatWith: ChatPanelType
  dist: BotInfoInterface
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
  | 'generative'
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
