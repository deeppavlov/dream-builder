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
  name: string
  author: string
  dateCreated: string
  desc: string
  version: string
  ram: string
  gpu: string
  skillType: SkillType
  space?: string
  time?: string
  botName?: string
  executionTime?: string
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
