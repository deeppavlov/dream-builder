import { useEffect, useState } from 'react'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import BaseSidePanel, {
  TRIGGER_RIGHT_SP_EVENT,
} from '../BaseSidePanel/BaseSidePanel'
import { SmallTag } from '../SmallTag/SmallTag'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import { TotalResourcesInterface } from '../../types/types'
import s from './ResourcesSidePanel.module.scss'
import ResourcesTable from '../ResourcesTable/ResourcesTable'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'

interface Props {
  resources: TotalResourcesInterface
}

const ResourcesSidePanel = ({ resources }: Props) => {
  const [res, setRes] = useState<TotalResourcesInterface>(resources)

  const handleCloseBtnClick = () =>
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })

  return (
    <>
      <SidePanelHeader>Total Resources</SidePanelHeader>
      <div className={s.resourcesSidePanel}>
        <div className={s.resourcesBlock}>
          <div className={s.resourcesBlock__header}>
            <span className={s.resourcesBlock__name}>Using proxy</span>
            <SmallTag>{res?.proxy.containers ?? 0} containers</SmallTag>
          </div>
          <p className={s.resourcesBlock__about}>
            Some information about proxy
          </p>

          <ResourcesTable
            values={[
              {
                name: 'RAM',
                value: res?.proxy.ram || '0.0 GB',
              },
              {
                name: 'GPU',
                value: res?.proxy.gpu || '0.0 GB',
              },
              {
                name: 'Disk Space',
                value: res?.proxy.space || '0.0 GB',
              },
            ]}
          />
        </div>
        {/* <div className={s.resourcesBlock}>
          <div className={s.resourcesBlock__header}>
            <span className={s.resourcesBlock__name}>Custom</span>
            <SmallTag>{res?.custom.containers ?? 0} container</SmallTag>
          </div>
          <p className={s.resourcesBlock__about}>
            You’ve changed Intent Catcher, this container will use memory:
          </p>
          <ResourcesTable
            values={[
              {
                name: 'RAM',
                value: res?.custom.ram || '0.0 GB',
              },
              {
                name: 'GPU',
                value: res?.custom.gpu || '0.0 GB',
              },
              {
                name: 'Disk Space',
                value: res?.custom.space || '0.0 GB',
              },
            ]}
          />
        </div> */}
        <div className={s.resourcesSidePanel__btns}>
          <Button theme='secondary' props={{ onClick: handleCloseBtnClick }}>
            Close
          </Button>
        </div>
      </div>
    </>
  )
}

export default ResourcesSidePanel
