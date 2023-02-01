export interface UserInterface {
  name: string
  email: string
  picture: string
}

export interface UserContext {
  user: UserInterface | null
  setUser: (user: UserInterface) => void
  login: (res: any) => void
  logout: () => void
}

export type CustomEventName = string

export type CustomEventListener = (data: any) => void

export interface BotInfoInterface {
  name: string
  routingName: string
  author: string
  authorImg: string
  desc: string
  dateCreated: string
  version: string
  ram: string
  gpu: string
  space: string
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
export type SkillType =
  | 'fallbacks'
  | 'retrieval'
  | 'generative'
  | 'q_a'
  | 'script'
  | 'script_with_nns'

export type AnnotatorType = 'dictionary' | 'ml_based' | 'nn_based' | 'external'

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
