import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './ResourcesSidePanel.module.scss'

const ResourcesSidePanel = ({
  isOpen,
  setIsOpen,
  position,
}: SidePanelProps) => {
  const handleCloseBtnClick = () => setIsOpen(false)

  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      name='Total Resources'>
      <div className={s.resourcesSidePanel}>
        <div className={s.resourcesBlock}>
          <div className={s.resourcesBlock__header}>
            <span className={s.resourcesBlock__name}>Using proxy</span>
            <SmallTag>30 containers</SmallTag>
          </div>
          <p className={s.resourcesBlock__about}>
            Some information about proxy
          </p>
          <ul className={s.resourcesBlock__table}>
            <li>
              <span>RAM:</span>
              <span className={s['resourcesBlock__table-count']}>0.0 GB</span>
            </li>
            <li>
              <span>GPU:</span>
              <span className={s['resourcesBlock__table-count']}>0.0 GB</span>
            </li>
            <li>
              <span>Disk space:</span>
              <span className={s['resourcesBlock__table-count']}>0.0 GB</span>
            </li>
          </ul>
        </div>
        <div className={s.resourcesBlock}>
          <div className={s.resourcesBlock__header}>
            <span className={s.resourcesBlock__name}>Custom</span>
            <SmallTag>1 container</SmallTag>
          </div>
          <p className={s.resourcesBlock__about}>
            You’ve changed Intent Catcher, this container will use memory:
          </p>
          <ul className={s.resourcesBlock__table}>
            <li>
              <span>RAM:</span>
              <span className={s['resourcesBlock__table-count']}>5.0 GB</span>
            </li>
            <li>
              <span>GPU:</span>
              <span className={s['resourcesBlock__table-count']}>4.0 GB</span>
            </li>
            <li>
              <span>Disk space:</span>
              <span className={s['resourcesBlock__table-count']}>7.0 GB</span>
            </li>
          </ul>
        </div>
        <div className={s.resourcesSidePanel__btns}>
          <Button theme='secondary' props={{ onClick: handleCloseBtnClick }}>
            Close
          </Button>
        </div>
      </div>
    </BaseSidePanel>
  )
}

export default ResourcesSidePanel
