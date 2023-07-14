import { get_encoding } from '@dqbd/tiktoken'
import { LanguageModel } from '../types/types'

const getTokensLength = (lm: LanguageModel | undefined, value: string) => {
  const encodingModels = new Map([
    ['ChatGPT', 'cl100k_base'],
    ['GPT-3.5', 'p50k_base'],
  ])
  const defaultEncodingModel = 'gpt2'
  const currentEncodingModel: any = lm
    ? encodingModels.get(lm) ?? defaultEncodingModel
    : defaultEncodingModel
  const encoding = get_encoding(currentEncodingModel)
  const tokens = encoding.encode(value)

  encoding.free()

  return tokens.length
}

export default getTokensLength
