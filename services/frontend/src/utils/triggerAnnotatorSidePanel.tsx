import { IStackElement } from 'types/types'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import AnnotatorSidePanel from 'components/Unused/AnnotatorSidePanel/AnnotatorSidePanel'
import IntentCatcherSidePanel from 'components/Unused/IntentCatcherSidePanel/IntentCatcherSidePanel'
import { trigger } from './events'

interface Props {
  annotator: IStackElement
  activeTab: 'Properties' | 'Editor'
  name?: string
}

const getAnnotatorSidePanel = ({ annotator, activeTab, name }: Props): void => {
  switch (annotator.display_name) {
    case 'Intent Catcher':
      trigger(TRIGGER_RIGHT_SP_EVENT, {
        children: (
          <IntentCatcherSidePanel
            key={annotator.id + activeTab}
            annotator={annotator}
            activeTab={activeTab}
            disabled
          />
        ),
      })
      break
    default:
      trigger(TRIGGER_RIGHT_SP_EVENT, {
        children: (
          <AnnotatorSidePanel
            key={annotator.id + activeTab}
            annotator={annotator}
            activeTab={activeTab}
            name={name}
          />
        ),
      })
      break
  }
}

export default getAnnotatorSidePanel
