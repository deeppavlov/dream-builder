type ModelTypeMap = { [key: string]: string }

export const modelTypeMap: ModelTypeMap = {
  'Dictionary/Pattern-based': 'dictionary',
  'NN-based': 'nn_based',
  'ML-based': 'ml_based',
  'External API': 'external',
} as const
