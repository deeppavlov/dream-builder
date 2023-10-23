import { useUIOptions } from 'context'
import { FC, useEffect, useState } from 'react'
import { ELOCALES_KEY, ISkill, SkillListProps } from 'types/types'
import { consts } from 'utils/consts'
import { sortSkillsBylang } from 'utils/sortSkillsBylang'
import { SkillCard } from 'components/Cards'
import { SkillListItem } from 'components/Tables'

export const SkillList: FC<SkillListProps> = ({
  view,
  skills,
  type,
  forGrid,
  forModal,
  withoutDate,
  handleAdd,
}) => {
  const [sortedSkills, setSortedSkills] = useState<ISkill[]>([])
  const { UIOptions } = useUIOptions()
  const assistantLang: ELOCALES_KEY =
    UIOptions[consts.ACTIVE_ASSISTANT].language?.value

  const handleLangChange = () =>
    skills && setSortedSkills([...sortSkillsBylang(skills, assistantLang)])

  useEffect(() => {
    handleLangChange()
  }, [skills, assistantLang])

  return (
    <>
      {sortedSkills?.map((skill, i) => {
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
