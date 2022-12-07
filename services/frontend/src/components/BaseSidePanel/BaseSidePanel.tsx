import React from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import SidePanel, { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import s from './BaseSidePanel.module.scss'

interface props extends SidePanelProps, React.PropsWithChildren {
  name?: string
}

const BaseSidePanel = ({
  isOpen,
  setIsOpen,
  position,
  name,
  children,
}: props) => {
  const closeModal = () => setIsOpen(false)

  return (
    <SidePanel isOpen={isOpen} setIsOpen={setIsOpen} position={position}>
      <div className={s.baseSidePanel}>
        <div className={s.baseSidePanel__header}>
          <span>{name ?? 'Side panel'}</span>
          <button onClick={closeModal}>
            <CloseIcon className={s.baseSidePanel__close} />
          </button>
        </div>
        {children}
      </div>
    </SidePanel>
  )
}

export default BaseSidePanel
