import { useEffect, useState } from 'react'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import { SmallTag } from '../SmallTag/SmallTag'
import { subscribe, unsubscribe } from '../../utils/events'
import { TotalResourcesInterface } from '../../types/types'
import s from './ResourcesSidePanel.module.scss'

const ResourcesSidePanel = ({ position }: Partial<SidePanelProps>) => {
  const [res, setRes] = useState<TotalResourcesInterface | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    subscribe('ResourcesSidePanel', handleEventUpdate)
    return () => unsubscribe('ResourcesSidePanel', handleEventUpdate)
  }, [])

  const handleEventUpdate = (data: { detail: TotalResourcesInterface }) => {
    setRes(data.detail)
    setIsOpen(!isOpen)
  }

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
            <SmallTag>{res?.proxy.containers ?? 0} containers</SmallTag>
          </div>
          <p className={s.resourcesBlock__about}>
            Some information about proxy
          </p>
          <ul className={s.resourcesBlock__table}>
            <li>
              <span>RAM:</span>
              <span className={s['resourcesBlock__table-count']}>
                {res?.proxy.ram ?? '0.0 GB'}
              </span>
            </li>
            <li>
              <span>GPU:</span>
              <span className={s['resourcesBlock__table-count']}>
                {res?.proxy.gpu ?? '0.0 GB'}
              </span>
            </li>
            <li>
              <span>Disk space:</span>
              <span className={s['resourcesBlock__table-count']}>
                {res?.proxy.space ?? '0.0 GB'}
              </span>
            </li>
          </ul>
        </div>
        <div className={s.resourcesBlock}>
          <div className={s.resourcesBlock__header}>
            <span className={s.resourcesBlock__name}>Custom</span>
            <SmallTag>{res?.custom.containers ?? 0} container</SmallTag>
          </div>
          <p className={s.resourcesBlock__about}>
            You’ve changed Intent Catcher, this container will use memory:
          </p>
          <ul className={s.resourcesBlock__table}>
            <li>
              <span>RAM:</span>
              <span className={s['resourcesBlock__table-count']}>
                {res?.custom.ram ?? '0.0 GB'}
              </span>
            </li>
            <li>
              <span>GPU:</span>
              <span className={s['resourcesBlock__table-count']}>
                {res?.custom.gpu ?? '0.0 GB'}
              </span>
            </li>
            <li>
              <span>Disk space:</span>
              <span className={s['resourcesBlock__table-count']}>
                {res?.custom.space ?? '0.0 GB'}
              </span>
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
