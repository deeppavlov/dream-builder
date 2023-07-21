import { get_encoding } from '@dqbd/tiktoken'
import { modelEncodingMap } from 'mapping/modelEncodingMap'
import { LanguageModel } from '../types/types'

const getTokensLength = (lm: LanguageModel | undefined, value: string) => {
  const defaultEncodingModel = 'gpt2'
  const currentEncodingModel: any = lm
    ? modelEncodingMap[lm] ?? defaultEncodingModel
    : defaultEncodingModel
  const encoding = get_encoding(currentEncodingModel)
  const tokens = encoding.encode(value)

  encoding.free()

  return tokens.length
}

export default getTokensLength
