import { FC } from 'react'
import { SkillListProps } from '../../types/types'
import { SkillCard } from '../SkillCard/SkillCard'
import { SkillListItem } from '../SkillListItem/SkillListItem'

export const SkillList: FC<SkillListProps> = ({
  view,
  skills,
  type,
  forGrid,
  forModal,
}) => {
  return (
    <>
      {skills?.map((skill, i) => {
        return view == 'table' ? (
          <SkillListItem forModal={forModal} key={i} skill={skill} />
        ) : (
          <SkillCard key={i} skill={skill} type={type!} forGrid={forGrid} />
        )
      })}
    </>
  )
}
