import AnnotatorSidePanel from '../components/AnnotatorSidePanel/AnnotatorSidePanel'
import { TRIGGER_RIGHT_SP_EVENT } from '../components/BaseSidePanel/BaseSidePanel'
import IntentCatcherSidePanel from '../components/IntentCatcherSidePanel/IntentCatcherSidePanel'
import { Annotator } from '../types/types'
import { trigger } from './events'

interface Props {
  annotator: Annotator
  activeTab: 'Properties' | 'Editor'
}

const getAnnotatorSidePanel = ({ annotator, activeTab }: Props): void => {
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
          />
        ),
      })
      break
  }
}

export default getAnnotatorSidePanel
