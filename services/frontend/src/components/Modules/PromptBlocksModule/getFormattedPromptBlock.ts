import { IPromptBlock } from 'types/types'

interface IProps {
  prompt: string
  block: IPromptBlock
}

const getFormattedPromptBlock = ({ prompt, block }: IProps) => {
  const { template, newline_before, newline_after } = block
  const isPrompt = prompt.length > 0
  const lineBefore = newline_before ? (isPrompt ? '\n\n' : '') : ' '
  const lineAfter = newline_after ? '\n' : ''

  return `${lineBefore}${template}${lineAfter}`
}

export default getFormattedPromptBlock
