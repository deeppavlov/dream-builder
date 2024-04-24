type serviceCompanyMap = { [key: string]: string }

export const serviceCompanyMap: serviceCompanyMap = {
  'transformers-lm-oasst12b-2m': 'openassistant_company',
  'transformers-lm-oasst12b': 'openassistant_company',
  'transformers-lm-gptjt': 'together_company',
  'openai-api-gpt4-32k': 'openai_company',
  'openai-api-gpt4': 'openai_company',
  'openai-api-gpt4-turbo': 'openai_company',
  'openai-api-chatgpt': 'openai_company',
  'openai-api-davinci3': 'openai_company',
  'openai-api-chatgpt-16k': 'openai_company',
  'anthropic-api-claude-v1': 'anthropic_company',
  'anthropic-api-claude-instant-v1': 'anthropic_company',
  'transformers-lm-rugpt35': 'sber_devices',
  'transformers-lm-ruxglm': 'zdeeppavlov', // starts with z because it's sorted by company names
  'gigachat-api': 'sber_devices',
  'gigachat-pro-api': 'sber_devices',
  'gigachat-plus-api': 'sber_devices',
} as const
