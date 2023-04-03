import AnnotatorSidePanel from '../components/AnnotatorSidePanel/AnnotatorSidePanel'
import { TRIGGER_RIGHT_SP_EVENT } from '../components/BaseSidePanel/BaseSidePanel'
import IntentCatcherSidePanel from '../components/IntentCatcherSidePanel/IntentCatcherSidePanel'
import { IStackElement } from '../types/types'
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
            key={annotator.name + activeTab}
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
            key={annotator.name + activeTab}
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
