export const servicesList = new Map([
  [
    'ChatGPT',
    {
      description:
        'ChatGPT is the GPT-3.5 model optimized for chat at 1/10th the cost of text-davinci-003. ChatGPT is available as gpt-3.5-turbo in OpenAI API on a paid basis and requiring an individual API key. It contains 175 billion parameters. ChatGPT accepts at maximum 4,096 tokens.',
      link: 'https://chat.openai.com/',
      name: 'openai-api-chatgpt',
    },
  ],
  [
    'GPT-3.5',
    {
      description:
        'GPT-3.5 is a language model available as text-davinci-003 in OpenAI API on a paid basis and requiring an individual API key. It contains 175 billion parameters. GPT-3.5 accepts at maximum 4,097 tokens.',
      link: 'https://beta.openai.com/playground',
      name: 'openai-api-davinci3',
    },
  ],
  [
    'GPT-J 6B',
    {
      description:
        'GPT-J 6B is an open-source language model from transformers. It contains 6 billion parameters, and is 30 times smaller than GPT-3 175B while having a comparable generation quality. GPT-J 6B accepts at maximum 2,048 tokens.',
      link: 'https://huggingface.co/EleutherAI/gpt-j-6B',
      name: 'transformers-lm-gptj',
    },
  ],
  [
    'BLOOMZ 7B',
    {
      description:
        'BLOOMZ 7B is an open-source multilingual language model from transformers. It contains 7.1 billion parameters. BLOOMZ 7B accepts at maximum 2,048 tokens.',
      link: 'https://huggingface.co/bigscience/bloomz-7b1',
      name: 'transformers-lm-bloomz7b',
    },
  ],
])
