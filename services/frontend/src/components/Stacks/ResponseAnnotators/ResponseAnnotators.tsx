import { FC } from 'react'
import ResponseAnnotatorsLogo from 'assets/icons/response_annotators.svg'
import { IStackElement } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { AddButtonStack } from 'components/Buttons'
import { Accordion } from 'components/Dropdowns'
import { AnnotatorElement } from 'components/Stacks/AnnotatorElement'
import { WaitForNextRelease } from 'components/Stacks/WaitForNextRelease'
import s from './ResponseAnnotators.module.scss'

interface Props {
  responseAnnotators: IStackElement[]
}

export const ResponseAnnotators: FC<Props> = ({ responseAnnotators }) => {
  const { isPreview } = usePreview()
  return (
    <>
      {responseAnnotators && (
        <div className={s.stack}>
          <div className={s.header}>
            <div className={s.top}>
              <div className={s.title}>
                <img src={ResponseAnnotatorsLogo} className={s.icon} />
                <p className={s.type}>Response Annotators</p>
              </div>
            </div>
            <div className={s.bottom}></div>
          </div>
          <div className={s.body}></div>
          <AddButtonStack disabled={true} text='Add Response Annotators' />
          <div className={s.elements}>
            <Accordion title='Customizable'>
              <WaitForNextRelease />
              {responseAnnotators?.map((annotator, i) => {
                if (annotator.is_customizable) {
                  return (
                    <AnnotatorElement
                      key={annotator.name + i}
                      annotator={annotator}
                      isPreview={isPreview}
                    />
                  )
                }
              })}
            </Accordion>
            <Accordion isActive title='Non-customizable'>
              {responseAnnotators?.map((annotator, i) => {
                if (!annotator.is_customizable) {
                  return (
                    <AnnotatorElement
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
      )}
    </>
  )
}
