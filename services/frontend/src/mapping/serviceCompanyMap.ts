type setviceCompanyMap = { [key: string]: string }

export const serviceCompanyMap: setviceCompanyMap = {
  'transformers-lm-oasst12b-2m': 'openassistant_company',
  'transformers-lm-oasst12b': 'openassistant_company',
  'transformers-lm-gptjt': 'together_company',
  'openai-api-gpt4-32k': 'openai_company',
  'openai-api-gpt4': 'openai_company',
  'openai-api-chatgpt': 'openai_company',
  'openai-api-davinci3': 'openai_company',
  'openai-api-chatgpt-16k': 'openai_company',
  'anthropic-api-claude-v1': 'anthropic_company',
  'anthropic-api-claude-instant-v1': 'anthropic_company',
} as const
