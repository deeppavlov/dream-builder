import { CSSProperties, FC, useId } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { RotatingLines } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
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
import { sortByISO8601 } from '../utils/sortByISO8601'

type IHandler = (e: React.MouseEvent<HTMLButtonElement>, id: number) => void

function filterStack(arr: IDeploymentState[]) {
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
    obj => !excludedValues.includes(obj.virtual_assistant.name)
  )
}

export const DraftPage = () => {
  const { requests, confirm, decline } = useAdmin()
  const { deployments, deleteDeployment } = useDeploy()

  const filteredDeployment = filterStack(deployments?.data!)

  const sortedDeployment = sortByISO8601(filteredDeployment)
  const sortedRequest = sortByISO8601(requests!)
  const navigate = useNavigate()
  const cardClickHandler = (name: string) => {
    navigate(`/${name}`)
  }
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
          <Container gridForRequests>
            {sortedRequest?.map((r, i: number) => {
              return (
                <Request
                  confirm={confirm}
                  decline={decline}
                  cardClickHandler={() => {
                    cardClickHandler(r?.virtual_assistant?.name)
                  }}
                  r={r}
                  key={i}
                  handleApprove={handleApprove}
                  handleDecline={handleDecline}
                />
              )
            })}
          </Container>
        </Wrapper>
        <Wrapper
          fitScreen
          title='Deployments'
          amount={sortedDeployment?.length > 0 ? sortedDeployment?.length : ''}
        >
          {deployments?.isLoading && (
            <div
              style={{
                alignSelf: 'center',
                justifySelf: 'center',
              }}
            >
              <RotatingLines
                strokeColor='grey'
                strokeWidth='5'
                animationDuration='0.75'
                width='64'
                visible={true}
              />
            </div>
          )}
          <Container gridForDeploys>
            {sortedDeployment?.map((deployment, i: number) => {
              return (
                <div key={i}>
                  <Wrapper>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: '8px',
                        height: '250px',
                      }}
                    >
                      <span style={{ overflow: 'hidden' }}>
                        id:{deployment?.id}
                      </span>
                      <span>name:{deployment?.virtual_assistant?.name}</span>
                      <span>
                        display name:
                        {deployment?.virtual_assistant?.display_name}
                      </span>
                      <span>
                        author:{deployment?.virtual_assistant?.author?.fullname}
                      </span>
                      <span
                        style={{ cursor: 'pointer' }}
                        data-tooltip-id={
                          deployment?.id + deployment?.virtual_assistant?.name
                        }
                      >
                        <BaseToolTip
                          delayShow={50}
                          id={
                            deployment?.id + deployment?.virtual_assistant?.name
                          }
                          content={deployment?.virtual_assistant?.description}
                        />
                        description
                      </span>
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
