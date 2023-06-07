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
  withoutDate,
  handleAdd,
}) => {
  return (
    <>
      {skills?.map((skill, i) => {
        return view == 'table' ? (
          <SkillListItem
            handleAdd={handleAdd}
            forModal={forModal}
            key={i}
            skill={skill}
            type={type!}
            withoutDate={withoutDate}
          />
        ) : (
          <SkillCard key={i} skill={skill} type={type!} forGrid={forGrid} />
        )
      })}
    </>
  )
}
