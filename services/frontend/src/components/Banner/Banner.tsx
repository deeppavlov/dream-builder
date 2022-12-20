import { UserInterface } from '../../types/types'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import s from './Banner.module.scss'

interface BannerProps {
  name: string
}

export const Banner = ({ name }: BannerProps) => {
  return (
    <>
      <Wrapper alignItems='start' closable={true}>
        <h5>
          {name.split(' ')[0]}, welcome to
          <span className={s.accent_text}> Dream Builder</span> Console!
        </h5>
        <ul>
          <p className={s.annotations}>
            You can now build and manage your own virtual assistants & chatbots!
          </p>
          <li className={s.li}> Construct it as a lego.</li>
          <li className={s.li}>
            No more coding, compose it visually on your board
          </li>
          <li className={s.li}>
            Control, manage, chat with your virtual assistant in a single place.
          </li>
        </ul>
      </Wrapper>
    </>
  )
}
