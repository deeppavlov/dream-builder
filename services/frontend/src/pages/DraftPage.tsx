import { useId } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../components/BaseToolTip/BaseToolTip'
import { Main } from '../components/Main/Main'
import { TOOLTIP_DELAY } from '../constants/constants'
import { useAdmin } from '../hooks/useAdmin'
import Button from '../ui/Button/Button'
import { Container } from '../ui/Container/Container'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { dateToUTC } from '../utils/dateToUTC'

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
  // const ref = useRef()
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

  return (
    <>
      <Main>
        <Wrapper>
          <Container gridForRequests scroll>
            {/* <DistList
              view={'cards'}
              dists={requests?.map(r => {
                return r?.virtual_assistant
              })}
              type={'your'}
            /> */}
            {requests?.map((r: any, i: number) => {
              return (
                <Request
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
      </Main>
      <BaseSidePanel />
      <Toaster />
    </>
  )
}
const Request = ({ cardClickHandler, r,  handleApprove, handleDecline }) => {
  const tooltipId = useId()
  const style = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '32px',
  }

  return (
    <div onClick={cardClickHandler}>
      <Wrapper forCard>
        <span>
          <b>id: </b>
          <mark>{r?.id}</mark>
        </span>
        <span>
          <b>name: </b>
          <mark>{r?.virtual_assistant?.display_name}</mark>
        </span>
        <span>
          <b>display_name: </b>
          <mark>{r?.virtual_assistant?.name}</mark>
        </span>
        <span
          data-tooltip-id={'requestDesc' + tooltipId}
          style={{ maxHeight: '22.5px', overflow: 'hidden' }}
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
        <span>
          <b>author: </b>
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
            }}
          >
            approve
          </Button>
          <Button
            props={{
              onClick: e => {
                handleDecline(e, r.id)
              },
            }}
            theme='secondary'
          >
            decline
          </Button>
        </div>
      </Wrapper>
    </div>
  )
}
