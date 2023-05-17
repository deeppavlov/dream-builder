import classNames from 'classnames/bind'
import { FC, useId, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useDisplay } from '../../context/DisplayContext'
import { useComponent } from '../../hooks/useComponent'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import { ISkill } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { consts } from '../../utils/consts'
import { srcForIcons } from '../../utils/srcForIcons'
import SkillStackToolTip from '../SkillStackToolTip/SkillStackToolTip'
import s from './SkillElement.module.scss'

interface SkillProps {
  skill: ISkill
  isPreview: boolean
}

export const SkillElement: FC<SkillProps> = ({ skill, isPreview }) => {
  const [disabled] = useState<boolean>(false)
  const skillRef = useRef(null)
  const { options } = useDisplay()
  const activeSKillId = options.get(consts.ACTIVE_SKILL_SP_ID)
  let tooltipId = useId()
  const cx = classNames.bind(s)
  const { name: distName } = useParams()
  const { deleteComponent } = useComponent()
  const deleteSkill = () => {
    const id = skill?.id!
    toast.promise(
      deleteComponent.mutateAsync({
        distName: distName || '',
        id,
        component_id: skill.component_id,
        type: 'skills',
      }),
      {
        loading: 'Deleting...',
        success: 'Success!',
        error: 'Something went wrong...',
      }
    )
  }

  return (
    <div
      className={cx('element', disabled && 'disabled')}
      ref={skillRef}
      data-active={skill.name === activeSKillId}
    >
      <div className={s.left}>
        <div className={s.top}>
          <img
            src={srcForIcons(componentTypeMap[skill?.component_type!])}
            className={s.icon}
          />
          <p className={s.name}>{skill?.display_name || '------'}</p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab tooltipId={tooltipId} />
        <SkillStackToolTip
          deleteFunc={deleteSkill}
          tooltipId={tooltipId}
          skill={skill}
          isCustomizable={skill?.is_customizable}
          isPreview={isPreview}
          skillRef={skillRef}
        />
      </div>
    </div>
  )
}
