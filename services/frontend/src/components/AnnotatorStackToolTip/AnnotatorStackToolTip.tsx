import { Component, IContextMenu } from '../../types/types'
import getAnnotatorSidePanel from '../../utils/triggerAnnotatorSidePanel'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'

interface Props extends IContextMenu {
  tooltipId: string
  annotator: Component
}

const AnnotatorStackToolTip = ({ tooltipId, annotator, isPreview }: Props) => {
  const handleEditBtnClick = () =>
    getAnnotatorSidePanel({ annotator, activeTab: 'Editor' })

  const handlePropertiesBtnClick = () =>
    getAnnotatorSidePanel({ annotator, activeTab: 'Properties' })

  return (
    <BaseContextMenu tooltipId={tooltipId}>
      {annotator.is_customizable && (
        <ContextMenuButton
          name='Edit Annotator'
          type='edit'
          disabled={isPreview}
          handleClick={handleEditBtnClick}
        />
      )}
      <ContextMenuButton
        name='Properties'
        type='properties'
        handleClick={handlePropertiesBtnClick}
      />
    </BaseContextMenu>
  )
}

export default AnnotatorStackToolTip
