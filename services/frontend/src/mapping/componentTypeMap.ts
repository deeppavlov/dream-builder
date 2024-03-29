import { ComponentType } from '../types/types'

type ComponentTypeMap = { [key: string]: ComponentType }

export const componentTypeMap: ComponentTypeMap = {
  'Script-based with NNs': 'script_with_nns',
  'Script-based w/o NNs': 'script',
  Fallback: 'fallback',
  Generative: 'generative',
  FAQ: 'q_a',
  Retrieval: 'retrieval',
} as const
