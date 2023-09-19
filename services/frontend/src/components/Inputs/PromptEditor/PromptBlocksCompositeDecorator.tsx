import { ContentBlock } from 'draft-js'
import { IPromptBlock } from 'types/types'

type IStrategyCallback = (start: number, end: number) => void

interface IStrategy {
  contentBlock: ContentBlock
  callback: IStrategyCallback
  regex: RegExp
}

const blockNames = [
  'YOUR PERSONALITY',
  'TASK',
  'CONTEXT ABOUT HUMAN',
  'INSTRUCTION',
  'EXAMPLE',
]

const getBlockNameRegEx = (keywords: string[]) => {
  const mergedKeywords = keywords.join('|')
  return new RegExp(`(?<=\\s|^)(${mergedKeywords})(?=\\:)`, 'g')
}

const getBlockInputRegEx = () => {
  return new RegExp(`(?<!<[^>]*|&[^;]*)(?<=\\[)(YOUR INPUT)(?=\\])`, 'g')
}

const BlockNameComponent = ({ children }: any) => (
  <u style={{ textUnderlineOffset: 3 }}>{children}</u>
)

const BlockInputComponent = ({ children }: any) => (
  <span style={{ color: '#3399CC' }}>{children}</span>
)

const findWithRegex = ({ regex, contentBlock, callback }: IStrategy) => {
  const text = contentBlock.getText()
  let matchArr, start

  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

const blockNameStrategy = (
  contentBlock: ContentBlock,
  callback: IStrategyCallback
) => {
  const regex = getBlockNameRegEx(blockNames)
  findWithRegex({ regex, contentBlock, callback })
}

const blockInputStrategy = (
  contentBlock: ContentBlock,
  callback: IStrategyCallback
) => {
  findWithRegex({ regex: getBlockInputRegEx(), contentBlock, callback })
}

export const PromptBlocksCompositeDecorator = (blocks?: IPromptBlock[]) => {
  // const isBlocks = blocks && blocks.length > 0

  // if (!isBlocks) return
  return [
    {
      strategy: blockNameStrategy,
      component: BlockNameComponent,
    },
    {
      strategy: blockInputStrategy,
      component: BlockInputComponent,
    },
  ]
}
