import { ReactComponent as DeepPavlovLogo } from '@assets/icons/deeppavlov_logo_round.svg'
import { ReactComponent as FallbackIcon } from '@assets/icons/fallbacks.svg'
import { ReactComponent as SkillScriptIcon } from '@assets/icons/skill_script.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import { Accordeon } from '../../ui/Accordeon/Accordeon'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import SmallTag from '../SmallTag/SmallTag'
import DateCard from '../DateCard/DateCard'
import s from './BotInfoSidePanel.module.scss'

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
          <div className={s.botInfoSidePanel__main}>
            <DateCard date={'12/15/2022'} />
            <div className={s.botInfoSidePanel__table}>
              <div className={s.botInfoSidePanel__author}>
                <DeepPavlovLogo />
                <span>Made by Deep Pavlov</span>
              </div>
              <ul className={s.resourcesBlock__table}>
                <li>
                  <span>RAM:</span>
                  <span className={s['resourcesBlock__table-count']}>
                    0.0 GB
                  </span>
                </li>
                <li>
                  <span>GPU:</span>
                  <span className={s['resourcesBlock__table-count']}>
                    0.0 GB
                  </span>
                </li>
                <li>
                  <span>Disk space:</span>
                  <span className={s['resourcesBlock__table-count']}>
                    0.0 GB
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <p className={s.botInfoSidePanel__desc}>
            Mini version of Deep Pavlov Dream Social bot. This is a
            generative-based social bot that uses English DialoGPT model to
            generate most of the responses. It also contains intent catcher and
            responder components to cover special user requests. Link to the
            distribution. Mini version of Deep Pavlov Dream Social bot. This is
            a generative-based social bot that uses English DialoGPT model to
            generate most of the responses. It also contains intent catcher and
            responder components to cover special user requests. Link to the
            distribution. Mini version of Deep Pavlov Dream Social bot. This is
            a generative-based social bot that uses English DialoGPT model to
            generate most of the responses. It also contains intent catcher and
            responder components to cover special user requests. Link to the
            distribution.
          </p>
        </div>
        <div className={s.botInfoSidePanel__accordions}>
          <Accordeon title='Annotators' rounded></Accordeon>
          <Accordeon title='Skills' rounded>
            <div className={s['botInfoSidePanel__accordion-item']}>
              <SkillScriptIcon />
              DFF Program-Y Skill
            </div>
            <div className={s['botInfoSidePanel__accordion-item']}>
              <SkillScriptIcon />
              DFF Intent Responder Skill
            </div>
            <div className={s['botInfoSidePanel__accordion-item']}>
              <FallbackIcon /> Dummy Skill
            </div>
          </Accordeon>
        </div>
        <div className={s.botInfoSidePanel__btns}>
          <Button theme='primary'>Clone</Button>
        </div>
      </div>
    </BaseSidePanel>
  )
}

export default BotInfoSidePanel
