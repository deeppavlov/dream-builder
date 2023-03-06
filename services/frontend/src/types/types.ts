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
export type CustomEventName = string

export type CustomEventListener = (data: any) => void

export type PostDistParams = {
  display_name: string
  description: string
}

export interface BotInfoInterface {
  name: string
  routingName: string
  author: string
  desc: string
  dateCreated: string
  version: string
  ram: string
  gpu: string
  space: string
  authorImg?: string
  annotators?: string[]
  skills?: string[]
}

export interface SkillInfoInterface {
  skillType: SkillType
  name: string
  botName: string
  author: string
  authorImg: string
  dateCreated: string
  desc: string
  version: string
  ram: string
  executionTime: string
  gpu: string
  display_name?: string
  space?: string
  time?: string
  model?: string
  prompt?: string
}

export interface Annotator {
  name: string
  display_name: string
  author: string
  type: AnnotatorType
  description: string
  date_created: string
  execution_time: string | number
  gpu_usage: string | number
  ram_usage: string | number
  disk_usage: string | number
  version: string | number
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

export type BotAvailabilityType = 'public' | 'your'
export type SkillAvailabilityType = 'public' | 'your'
export type CustomRouteConfig = RouteObject & { crumb?: string }

export interface dist_list {
  name: string // Routing distribution name
  display_name: string
  date_created: string | number | Date
  author: string
  description: string
  version: string
  ram_usage: string
  gpu_usage: string
  disk_usage: string
}
export interface Skill {
  name: string
  display_name: string
  author: string
  type: SkillType
  description: string
  date_created: string
  execution_time: string | number
  gpu_usage: string | number
  ram_usage: string | number
  disk_usage: string | number
  version: string | number
}

export type AnnotatorType = 'dictionary' | 'ml_based' | 'nn_based' | 'external'

export type SkillType =
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

export interface IAnnotator {
  name: string
  author: string
  authorImg: string
  type: string
  desc: string
}

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

export interface SettingKey {
  name: string
  type: 'switch' | 'checkbox' | 'radio' | 'input'
  value?: any
  checked?: boolean
}
