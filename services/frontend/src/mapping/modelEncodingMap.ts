type TModelEncodingMap = { [key: string]: string }

export const modelEncodingMap: TModelEncodingMap = {
  // 'transformers-lm-oasst12b-2m': 'gpt2',
  // 'transformers-lm-oasst12b': 'gpt2',
  // 'transformers-lm-gptjt': 'gpt2',
  // 'openai-api-gpt4-32k': 'gpt2',
  // 'openai-api-gpt4': 'gpt2',
  'openai-api-chatgpt': 'cl100k_base',
  'openai-api-davinci3': 'p50k_base',
  // 'openai-api-chatgpt-16k': 'gpt2',
  // 'anthropic-api-claude-v1': 'gpt2',
  // 'anthropic-api-claude-instant-v1': 'gpt2',
} as const
