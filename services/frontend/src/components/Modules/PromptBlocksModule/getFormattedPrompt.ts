import { IPromptBlock } from 'types/types'

interface IProps {
  prompt: string
  block: IPromptBlock
}

const getFormattedPrompt = ({ prompt, block }: IProps) => {
  const { template, newLineBefore, newLineAfter } = block
  const isPrompt = prompt.length > 0
  const lineBefore = newLineBefore ? (isPrompt ? '\n\n' : '') : ' '
  const lineAfter = newLineAfter ? '\n' : ''

  return `${prompt}${lineBefore}${template}${lineAfter}`
}

export default getFormattedPrompt
