import { IContextMenu, IStackElement } from '../../types/types'
import getAnnotatorSidePanel from '../../utils/triggerAnnotatorSidePanel'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'

interface Props extends IContextMenu {
  tooltipId: string
  annotator: IStackElement
  name?: string
}

const AnnotatorStackToolTip = ({
  tooltipId,
  annotator,
  isPreview,
  name,
}: Props) => {
  const handleEditBtnClick = () =>
    getAnnotatorSidePanel({ annotator, activeTab: 'Editor', name })

  const handlePropertiesBtnClick = () =>
    getAnnotatorSidePanel({ annotator, activeTab: 'Properties', name })

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
