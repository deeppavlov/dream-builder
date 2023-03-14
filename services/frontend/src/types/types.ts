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

export interface IPreviewContext {
  isPreview: boolean
  setIsPreview: (isPreview: boolean) => void
}

export interface BotInfoInterface {
  name: string
  display_name: string
  author: string
  description: string
  date_created: string
  ram_usage: string
  gpu_usage: string
  disk_usage: string
}

export interface SkillInfoInterface extends Component {}

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

export interface ISkillSelector {
  name: string
  display_name: string
  author: string
  component_type: string
  model_type: string
  date_created: string | Date
  description: string
  is_customizable: boolean
  ram_usage: string
  gpu_usage: string
  execution_type: string
}

export interface ISkillResponder {
  name: string
  display_name: string
  author: string
  component_type: string
  model_type: string
  date_created: string | Date
  description: string
  is_customizable: boolean
  ram_usage: string
  gpu_usage: string
  execution_type: string
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
  dists: [BotInfoInterface]
  type: BotAvailabilityType
  size?: BotCardSize
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
  author: string
  component_type: string | null
  model_type: string | null
  date_created: string | Date | null
  description: string
  is_customizable: boolean
  ram_usage: string
  gpu_usage: string
  execution_time: string
}

export interface ISkill extends IStackElement {
  model?: string
  prompt?: string
}
export type CustomRouteConfig = RouteObject & { crumb?: string }

export type CustomEventName = string

export type CustomEventListener = (data: any) => void

export type BotAvailabilityType = 'public' | 'your'

export type SkillAvailabilityType = 'public' | 'your'

export type ViewType = 'cards' | 'table'

export type BotCardSize = 'big' | 'small'

export type ModelType = 'dictionary' | 'ml_based' | 'nn_based' | 'external'

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

export type MenuTypes =
  | 'main'
  | 'bots'
  | 'skills_page'
  | 'editor'
  | 'bot_public'
  | 'your_bot'
  | 'skills'
  | 'all_annotators'
  | 'response_annotators'
  | 'all_skills'
  | 'customizable_annotator'
  | 'customizable_skill'
  | 'non_customizable_annotator'
  | 'non_customizable_skill'
  | 'skill_selector'
  | 'response_selector'
  | null
  | false
