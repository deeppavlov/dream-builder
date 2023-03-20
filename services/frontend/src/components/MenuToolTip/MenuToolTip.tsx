import { TMenu } from '../../ui/Menu/Menu'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import ContextMenuButton from '../ContextMenuButton/ContextMenuButton'
import { mockSkills } from '../../mocks/database/mockSkills'
import { BotInfoInterface } from '../../types/types'
import { usePreview } from '../../Context/PreviewProvider'
import { useNavigate } from 'react-router-dom'
import { RoutesList } from '../../router/RoutesList'

interface Props {
  tooltipId: string
  type: TMenu
}

const MenuToolTip = ({ tooltipId, type }: Props) => {
  return (
    <BaseContextMenu tooltipId={tooltipId} place='bottom'>
      {type === 'main' && (
        <ContextMenuButton>
          <a href={'http://deepdream.builders'} target='_blank'>
            About Dream Builder
          </a>
        </ContextMenuButton>
      )}
      {type === 'editor' && (
        <>
          <ContextMenuButton type='about'>
            <a href={'http://deepdream.builders'} target='_blank'>
              Information about DB
            </a>
          </ContextMenuButton>
          <ContextMenuButton name='Welcome guide' type='properties' />
          <hr />
          <ContextMenuButton name='Save' type='save' />
          <ContextMenuButton name='Rename' type='edit' />
          <hr />
          <ContextMenuButton name='Add Skills' type='add' />
          <hr />
          <ContextMenuButton
            disabled={isPreview}
            name='Publish'
            type='publish'
            handleClick={handlePublishClick}
          />
          <ContextMenuButton
            name='Share'
            type='share'
            handleClick={handleShareClick}
          />
          <hr />
          <ContextMenuButton name='Delete' type='delete' />
        </>
      )}
    </BaseContextMenu>
  )
}

export default MenuToolTip
