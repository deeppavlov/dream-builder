import ResponseAnnotatorsLogo from '../../assets/icons/response_annotators.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { Element } from './Element'
import s from './ResponseAnnotators.module.scss'

export const ResponseAnnotators = ({ responseAnnotatorsList }: any) => {
  return (
    <>
      {responseAnnotatorsList && (
        <div className={s.stack}>
          <div className={s.header}>
            <div className={s.top}>
              <div className={s.title}>
                <img src={ResponseAnnotatorsLogo} className={s.icon} />
                <p className={s.type}>Response Annotators</p>
              </div>
              <Kebab disabled dataFor='response_annotators' />
            </div>
            <div className={s.bottom}>
              <p className={s.data}>
                {responseAnnotatorsList.recources &&
                  '0.00 GB RAM | 0.00 GB GPU'}
              </p>
            </div>
          </div>
          <div className={s.body}></div>
          <AddButtonStack disabled={true} text='Add Candidate Annotators' />
          <div className={s.elements}>
            <Accordion title='Non-customizable'>
              {responseAnnotatorsList?.map((i: string) => {
                return <Element title={i} />
              })}
            </Accordion>
          </div>
        </div>
      )}
    </>
  )
}
