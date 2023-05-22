import { get_encoding } from '@dqbd/tiktoken'
import { LanguageModel } from '../types/types'

const getTokensLength = (lm: LanguageModel | undefined, value: string) => {
  switch (lm) {
    case 'ChatGPT':
      return get_encoding('cl100k_base').encode(value).length
    case 'GPT-3.5':
      return get_encoding('p50k_base').encode(value).length
    default:
      return get_encoding('gpt2').encode(value).length
  }
}

export default getTokensLength
