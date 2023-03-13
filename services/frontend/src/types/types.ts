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
  routingName: string
  name: string
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
