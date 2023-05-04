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
import { BotInfoInterface, IAuthor } from '../types/types'
import Button from '../ui/Button/Button'
import { Container } from '../ui/Container/Container'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { dateToUTC } from '../utils/dateToUTC'
import { sortDistsByISO8601 } from '../utils/sortDistsByISO8601'

interface RequestProps {
  cardClickHandler: () => void
  r: {
    id: number
    date_created: Date | null
    date_reviewed: Date | null
    is_confirmed: boolean | null
    reviewed_by_user: string | null
    visibility: 'public_template' | 'private' | 'unlisted'
    slug: string
    user: IAuthor
    virtual_assistant: BotInfoInterface
  }
  confirm: any
  decline: any
  handleApprove: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void
  handleDecline: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void
}

export const DraftPage = () => {
  const { requests, confirm, decline } = useAdmin()

  const cardClickHandler = () => {
    console.log('cardClicked')
  }

  const handleApprove = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    toast.promise(confirm.mutateAsync(id), {
      loading: 'approve...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })

    e.stopPropagation()
  }

  const handleDecline = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    toast.promise(decline.mutateAsync(id), {
      loading: 'decline...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })
    e.stopPropagation()
  }
  const { stacks, deleteStack } = useDeploy()
  const handleStop = (id: number) => {
    toast.promise(deleteStack.mutateAsync(id), {
      loading: 'delete stack...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })
  }

  function filterStack(arr) {
    const excludedValues = [
      'universal',
      'multiskill',
      'faq',
      'fashion',
      'marketing',
      'fairytale',
      'nutrition',
      'deepy',
      'coaching',
    ]
    return arr?.filter(obj => !excludedValues.includes(obj.Name))
  }
  const filtered = filterStack(stacks?.data)
  return (
    <>
      <Topbar />
      <Sidebar />
      <Main sidebar>
        <Wrapper fitScreen title='Publication Requests'>
          <Container gridForRequests scroll>
            {sortDistsByISO8601(requests)?.map((r: any, i: number) => {
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
        <Wrapper fitScreen title='Deployment State'>
          <Container gridForRequests>
            {filtered?.map((stack: any, i: number) => {
              stack?.Name !== 'deepy'
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
                      <span style={{ overflow: 'hidden' }}>id:{stack?.Id}</span>
                      <span>{stack?.Name}</span>
                      <div className=''>
                        <Button
                          theme='primary'
                          props={{
                            onClick: () => {
                              handleStop(stack?.Id)
                            },
                            disabled: deleteStack?.isLoading,
                          }}
                        >
                          Stop
                        </Button>
                      </div>
                    </div>
                  </Wrapper>
                </div>
              )
            })}{' '}
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
                onClick: e => {
                  handleApprove(e, r.id)
                },
                disabled: confirm?.isLoading,
              }}
            >
              approve
            </Button>
            <Button
              props={{
                onClick: e => {
                  handleDecline(e, r.id)
                },
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
