import { ReactComponent as PlusIcon } from '@assets/icons/plus_icon.svg'
import { ReactComponent as UploadIcon } from '@assets/icons/upload.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import s from './BotInfoSidePanel.module.scss'
import SmallTag from '../SmallTag/SmallTag'
import { Accordeon } from '../../ui/Accordeon/Accordeon'
import DateCard from '../DateCard/DateCard'

const BotInfoSidePanel = ({ isOpen, setIsOpen, position }: SidePanelProps) => {
  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      name='Properties'>
      <div className={s.botInfoSidePanel}>
        <div className={s.botInfoSidePanel__header}>
          <span className={s.botInfoSidePanel__name}>Dream Mini</span>
          <SmallTag theme='version'>v0.0.1</SmallTag>
          <SmallTag theme='default'>Hybrid bot</SmallTag>
        </div>
        <div className={s.botInfoSidePanel__container}>
          <DateCard date={"12/15/2022"} />
          <div>
            <span className={s.botInfoSidePanel__author}>
              Made by Deep Pavlov
            </span>
            <ul className={s.resourcesBlock__table}>
              <li>
                <span>RAM:</span>
                <span className={s['resourcesBlock__table-count']}>0.0 GB</span>
              </li>
              <li>
                <span>GPU:</span>
                <span className={s['resourcesBlock__table-count']}>0.0 GB</span>
              </li>
              <li>
                <span>Disk space:</span>
                <span className={s['resourcesBlock__table-count']}>0.0 GB</span>
              </li>
            </ul>
          </div>
          <p>
            Mini version of Deep Pavlov Dream Social bot. This is a
            generative-based social bot that uses English DialoGPT model to
            generate most of the responses. It also contains intent catcher and
            responder components to cover special user requests. Link to the
            distribution.
          </p>
        </div>
        <Accordeon title='Annotators'></Accordeon>
        <Accordeon title='Skills'>
          <div>DFF Program-Y Skill</div>
          <div>DFF Intent Responder Skill</div>
          <div>Dummy Skill</div>
        </Accordeon>
        <div className={s.botInfoSidePanel__btns}>
          <Button theme='primary'>Clone</Button>
        </div>
      </div>
    </BaseSidePanel>
  )
}

export default BotInfoSidePanel
