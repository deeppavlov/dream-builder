import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { Toaster } from 'react-hot-toast'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { dist_list } from '../types/types'
import { RoutesList } from '../Router/RoutesList'
import { useAuth } from '../Context/AuthProvider'
import { getAssistantDists } from '../services/getAssistantDists'
import { dateToUTC } from '../utils/dateToUTC'
import { timeToUTC } from '../utils/timeToUTC'
import { trigger } from '../utils/events'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Slider } from '../ui/Slider/Slider'
import { BotCard } from '../components/BotCard/BotCard'
import { BotListItem } from '../components/BotListItem/BotListItem'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { DeleteAssistantModal } from '../components/DeleteAssistantModal/DeleteAssistantModal'
import { PublishAssistantModal } from '../components/PublishAssistantModal/PublishAssistantModal'
import { getUsersAssistantDists } from '../services/getUsersAssistantDists'
import BaseSidePanel from '../components/BaseSidePanel/BaseSidePanel'
import { Modal } from '../components/Modal/Modal'
import { ShareModal } from '../components/ShareModal/ShareModal'
import { SignInModal } from '../components/SignInModal/SignInModal'

export const BotsPage = () => {
  const auth = useAuth()
  const [listView, setListView] = useState<boolean>(false)
  const topbarRef = useRef<HTMLDivElement | undefined>()
  const [topbarHeight, setTopbarHeight] = useState(0)

  const viewHandler = () => {
    setListView(listView => !listView)
  }
  const addBot = () => {
    trigger('AssistantModal', { action: 'create' })
  }

  const {
    isLoading: isAssistantsLoading,
    error: assistantsError,
    data: assistantsData,
  } = useQuery('assistant_dists', getAssistantDists)

  useEffect(() => {
    if (!isAssistantsLoading) {
      setTopbarHeight(topbarRef.current?.getBoundingClientRect().height ?? 0)
    }
  }, [isAssistantsLoading]) // Await when Topbar will mounted for calc his height in DOM

  assistantsError && <>{'An error has occurred:' + { assistantsError }}</>

  const {
    data: usersDistData,
    isLoading: isUsersDistDataLoading,
    error: usersDistDataError,
  } = useQuery('usersAssistantDists', getUsersAssistantDists, {
    // The query will not execute when user is not authorized
    enabled: !!auth?.user,
  })

  return (
    <>
      <Topbar innerRef={topbarRef} viewHandler={viewHandler} type='main' />
      <Main>
        {!listView ? (
          <>
            <Wrapper
              title='Public Virtual Assistants & Chatbots'
              amount={assistantsData?.length}
              linkTo={RoutesList.botsAll}
              showAll>
              <Container>
                <Slider>
                  {isAssistantsLoading && <>{'Loading...'}</>}
                  {assistantsData?.map((dist: dist_list, i: number) => {
                    const {
                      display_name,
                      name,
                      author,
                      description,
                      version,
                      ram_usage,
                      gpu_usage,
                      disk_usage,
                      date_created,
                    } = dist
                    const dateCreated = dateToUTC(new Date(date_created))

                    return (
                      <BotCard
                        routingName={name}
                        key={i}
                        type='public'
                        name={display_name}
                        author={author}
                        authorImg={DeepPavlovLogo}
                        dateCreated={dateCreated}
                        desc={description}
                        version={version}
                        ram={ram_usage}
                        gpu={gpu_usage}
                        space={disk_usage}
                        disabled={!auth?.user}
                      />
                    )
                  })}
                </Slider>
              </Container>
            </Wrapper>
            <Wrapper
              primary
              title='Your Virtual Assistants & Chatbots'
              amount={auth?.user && usersDistData?.length}
              showAll
              linkTo={RoutesList.yourBots}>
              <Container overflow='visible'>
                <Container
                  position='sticky'
                  left='0'
                  top='0'
                  width='280px'
                  minWidth='280px'
                  overflow='visible'
                  padding='0'
                  paddingBottom='22px'>
                  <AddButton
                    listView={listView}
                    addBot={addBot}
                    disabled={!auth?.user}
                  />
                </Container>
                <Container paddingBottom='22px'>
                  {isUsersDistDataLoading && 'Loading...'}
                  {usersDistDataError &&
                    'luck is not on your side! try to refresh the page' +
                      usersDistDataError}
                  <Slider>
                    {usersDistData?.map((dist: dist_list, i: number) => {
                      const {
                        display_name,
                        name,
                        author,
                        description,
                        version,
                        ram_usage,
                        gpu_usage,
                        disk_usage,
                        date_created,
                      } = dist
                      const dateCreated = dateToUTC(date_created)
                      return (
                        <BotCard
                          routingName={name}
                          key={i}
                          type='your'
                          size='small'
                          name={display_name}
                          author={author}
                          authorImg={DeepPavlovLogo}
                          dateCreated={dateCreated}
                          desc={description}
                          version={version}
                          ram={ram_usage}
                          gpu={gpu_usage}
                          space={disk_usage}
                          disabled={!auth?.user}
                        />
                      )
                    })}
                  </Slider>
                </Container>
              </Container>
            </Wrapper>
          </>
        ) : (
          <>
            <Wrapper
              title='Public Virtual Assistants & Chatbots'
              showAll
              amount={assistantsData?.length}
              linkTo={RoutesList.botsAll}
              fitScreen>
              <Table>
                {assistantsData?.map((dist: dist_list, i: number) => {
                  const {
                    name,
                    display_name,
                    author,
                    description,
                    version,
                    ram_usage,
                    gpu_usage,
                    disk_usage,
                    date_created,
                  } = dist
                  const dateCreated = dateToUTC(new Date(date_created))
                  const time = timeToUTC(new Date(date_created))

                  return (
                    <BotListItem
                      type='public'
                      key={i}
                      routingName={name}
                      name={display_name}
                      author={author}
                      authorImg={DeepPavlovLogo}
                      dateCreated={dateCreated}
                      time={time}
                      desc={description}
                      version={version}
                      ram={ram_usage}
                      gpu={gpu_usage}
                      space={disk_usage}
                      disabled={!auth?.user}
                    />
                  )
                })}
              </Table>
            </Wrapper>
            <Wrapper
              title='Your Virtual Assistants & Chatbots'
              primary
              showAll
              amount={auth?.user && usersDistData?.length}
              linkTo={RoutesList.yourBots}>
              <Table
                addButton={
                  <AddButton
                    addBot={addBot}
                    listView={listView}
                    disabled={!auth?.user}
                  />
                }>
                {usersDistData?.map((dist: dist_list, i: number) => {
                  const {
                    name,
                    display_name,
                    author,
                    description,
                    version,
                    ram_usage,
                    gpu_usage,
                    disk_usage,
                    date_created,
                  } = dist
                  const dateCreated = dateToUTC(date_created)
                  const time = timeToUTC(date_created)
                  return (
                    <BotListItem
                      type='your'
                      key={i}
                      routingName={name}
                      name={display_name}
                      author={author}
                      authorImg={DeepPavlovLogo}
                      dateCreated={dateCreated}
                      time={time}
                      desc={description}
                      version={version}
                      ram={ram_usage}
                      gpu={gpu_usage}
                      space={disk_usage}
                      disabled={!auth?.user}
                    />
                  )
                })}
              </Table>
            </Wrapper>
          </>
        )}
        <BaseSidePanel position={{ top: topbarHeight }} />
        <AssistantModal />
        <PublishAssistantModal />
        <DeleteAssistantModal />
        <ShareModal />
        <Modal />
        <SignInModal />
      </Main>
      <Toaster />
    </>
  )
}
