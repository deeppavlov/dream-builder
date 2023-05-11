import { CSSProperties, FC, useId } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../components/BaseToolTip/BaseToolTip'
import { Main } from '../components/Main/Main'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Topbar } from '../components/Topbar/Topbar'
import { TOOLTIP_DELAY } from '../constants/constants'
import { useAdmin } from '../hooks/useAdmin'
import { useDeploy } from '../hooks/useDeploy'
import { toasts } from '../mapping/toasts'
import { IDeploymentState, RequestProps } from '../types/types'
import Button from '../ui/Button/Button'
import { Container } from '../ui/Container/Container'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { dateToUTC } from '../utils/dateToUTC'
import { sortDistsByISO8601 } from '../utils/sortDistsByISO8601'

type IHandler = (e: React.MouseEvent<HTMLButtonElement>, id: number) => void

function filterStack(arr: any) {
  const excludedValues = [
    'universal_prompted_assistant',
    'multiskill_ai_assistant',
    'ai_faq_assistant',
    'fashion_stylist_assistant',
    'marketing_assistant',
    'fairytale_assistant',
    'nutrition_assistant',
    'deepy_assistant',
    'life_coaching_assistant',
    'deeppavlov_assistant',
  ]
  return arr?.filter(
    (obj: any) => !excludedValues.includes(obj.virtual_assistant.name)
  )
}

export const DraftPage = () => {
  const { requests, confirm, decline } = useAdmin()
  const { deployments, deleteDeployment } = useDeploy()

  const filtered: IDeploymentState[] = filterStack(deployments?.data)
  const sortedRequest = sortDistsByISO8601(requests)

  const cardClickHandler = () => {}
  const handleApprove: IHandler = (e, id) => {
    toast.promise(confirm.mutateAsync(id), toasts.confirmRequest)
    e.stopPropagation()
  }

  const handleDecline: IHandler = (e, id) => {
    toast.promise(decline.mutateAsync(id), toasts.declineRequest)
    e.stopPropagation()
  }

  const handleStop: IHandler = (e, id) => {
    toast.promise(deleteDeployment.mutateAsync(id), toasts.deleteDeployment)
    e.stopPropagation()
  }

  return (
    <>
      <Topbar />
      <Sidebar />
      <Main sidebar>
        <Wrapper fitScreen title='Publication Requests'>
          <Container gridForRequests scroll>
            {sortedRequest?.map((r, i: number) => {
              return (
                <Request
                  confirm={confirm}
                  decline={decline}
                  cardClickHandler={cardClickHandler}
                  r={r}
                  key={i}
                  handleApprove={handleApprove}
                  handleDecline={handleDecline}
                />
              )
            })}
          </Container>
        </Wrapper>
        <Wrapper fitScreen title='Deployments' amount={filtered?.length}>
          <Container gridForRequests>
            {filtered?.map((deployment, i: number) => {
              return (
                <div key={i}>
                  <Wrapper>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <span style={{ overflow: 'hidden' }}>
                        id:{deployment?.id}
                      </span>
                      <span>{deployment?.virtual_assistant?.name}</span>
                      <span>{deployment?.virtual_assistant?.display_name}</span>
                      <div className=''>
                        <Button
                          theme='primary'
                          props={{
                            onClick: e => handleStop(e, deployment?.id),
                            disabled: deleteDeployment?.isLoading,
                          }}
                        >
                          Stop
                        </Button>
                      </div>
                    </div>
                  </Wrapper>
                </div>
              )
            })}
          </Container>
        </Wrapper>
      </Main>
      <BaseSidePanel />
      <Toaster />
    </>
  )
}
const Request: FC<RequestProps> = ({
  cardClickHandler,
  r,
  handleApprove,
  handleDecline,
  confirm,
  decline,
}) => {
  const tooltipId = useId()
  const style = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '32px',
  } as CSSProperties

  return (
    <>
      <div onClick={cardClickHandler}>
        <Wrapper forCard>
          <span>
            <b>id: </b>
            <mark>{r?.id}</mark>
          </span>
          <span>
            <b>name: </b>
            <mark>{r?.virtual_assistant?.name}</mark>
          </span>
          <span>
            <b>display_name: </b>
            <mark>{r?.virtual_assistant?.display_name}</mark>
          </span>
          <span
            data-tooltip-id={'requestDesc' + tooltipId}
            style={{ maxHeight: '22px', overflow: 'hidden' }}
          >
            <b>description: </b>
            <mark>{r?.virtual_assistant?.description}</mark>
          </span>
          <BaseToolTip
            id={'requestDesc' + tooltipId}
            content={r?.virtual_assistant?.description}
            place='bottom'
            theme='description'
            delayShow={TOOLTIP_DELAY - 500}
          />
          <span>
            <b>date_created: </b>
            <mark>{dateToUTC(r?.date_created)}</mark>
          </span>
          <span style={{ display: 'flex' }}>
            <b>author: </b>
            <img
              style={{ height: '20px', borderRadius: '50%' }}
              src={r?.virtual_assistant?.author?.picture}
            />
            <mark>{r?.virtual_assistant?.author?.fullname}</mark>
          </span>
          <span>
            <b>email: </b>
            <mark>{r?.virtual_assistant?.author?.email}</mark>
          </span>
          <div style={style}>
            <Button
              theme='primary'
              props={{
                onClick: e => handleApprove(e, r.id),
                disabled: confirm?.isLoading,
              }}
            >
              approve
            </Button>
            <Button
              props={{
                onClick: e => handleDecline(e, r.id),
                disabled: decline?.isLoading,
              }}
              theme='secondary'
            >
              decline
            </Button>
          </div>
        </Wrapper>
      </div>
    </>
  )
}
