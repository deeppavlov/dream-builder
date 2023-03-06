import { FC } from 'react'
import { Kebab } from '../../ui/Kebab/Kebab'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import s from './Skill.module.scss'

interface SelectorProps {
  title: string
  desc: string
}

export const Skill: FC<SelectorProps> = ({ title, desc }) => {
  const cleanTitle = capitalizeTitle(title)
  return (
    <div className={s.skill}>
      <div className={s.left}>
        <p className={s.name}>{cleanTitle}</p>
      </div>
      <div className={s.arrow}>
        <Kebab
          dataFor='skill_selector'
          item={{
            typeItem: title,
            data: {
              display_name: title,
              desc
            },
          }}
        />
      </div>
    </div>
  )
}
