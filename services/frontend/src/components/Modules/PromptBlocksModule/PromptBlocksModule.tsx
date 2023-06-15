import { IPromptBlock } from 'types/types'
import { TOOLTIP_DELAY } from 'constants/constants'
import { BaseToolTip } from 'components/Menus'
import s from './PromptBlocksModule.module.scss'

interface IProps {
  blocks: IPromptBlock[]
  handleSelect?: (block: IPromptBlock) => void
}

export const PromptBlocksModule = ({ blocks, handleSelect }: IProps) => {
  const handleBlockClick = (block: IPromptBlock) => {
    if (handleSelect) handleSelect(block)
  }

  return (
    <div className={s.promptBlockModule}>
      <div className={s.container}>
        {blocks?.map((block, i) => (
          <span
            key={`key-${i}`}
            id={block.block}
            data-tooltip-id={block.block}
            className={s.block}
            onClick={() => handleBlockClick(block)}
          >
            {block.block}
            <BaseToolTip
              delayShow={TOOLTIP_DELAY}
              id={block.block}
              content={block.description}
              place='right'
              theme='description'
            />
          </span>
        ))}
      </div>
    </div>
  )
}
