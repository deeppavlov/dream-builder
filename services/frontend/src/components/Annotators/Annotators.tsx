import AnnotatorsLogo from '@assets/icons/annotators.svg'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { countResources } from '../../utils/countResources'
import { IStackElement } from '../../types/types'
import { usePreview } from '../../Context/PreviewProvider'
import { Element } from './Element'
import s from './Annotators.module.scss'

interface Props {
  annotators: IStackElement[]
}

export const Annotators = ({ annotators }: Props) => {
  const { isPreview } = usePreview()

  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={AnnotatorsLogo} className={s.icon} />
            <p className={s.type}>Annotators</p>
          </div>
          {/* <Kebab disabled dataFor='all_annotators' /> */}
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {(annotators &&
              countResources(annotators, 'ram_usage') +
                ' | ' +
                countResources(annotators, 'gpu_usage')) ||
              '0.00 GB RAM | 0.00 GB GPU'}
          </p>
        </div>
      </div>
      <AddButtonStack disabled={true} text='Add Annotators' />
      <div className={s.elements}>
        <Accordion title='Customizable'>
          {annotators?.map((annotator, i) => {
            if (annotator.is_customizable) {
              return (
                <Element
                  key={annotator.name + i}
                  annotator={annotator}
                  isPreview={isPreview}
                />
              )
            }
          })}
        </Accordion>
        <Accordion title='Non-customizable'>
          {annotators?.map((annotator, i) => {
            if (!annotator.is_customizable) {
              return (
                <Element
                  key={annotator.name + i}
                  annotator={annotator}
                  isPreview={isPreview}
                />
              )
            }
          })}
        </Accordion>
      </div>
    </div>
  )
}
