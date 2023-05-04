import { ModelType } from '../types/types'

type ModelTypeMap = { [key: string]: ModelType }

export const modelTypeMap: ModelTypeMap = {
  'Dictionary/Pattern-based': 'dictionary',
  'Dictionary 2': 'dictionary_second',
  'External API': 'external',
  'External 2': 'external',
  'NN-based': 'nn_based',
  'ML-based': 'ml_based',
} as const
