import { useState } from 'react'
import { useQuery } from 'react-query'
import { dateToUTC } from '../utils/dateToUTC'
import { getDistByName } from '../services/getDistByName'
import { getAssistantDists } from '../services/getAssistantDists'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { BotCard } from '../components/BotCard/BotCard'
import { Slider } from '../ui/Slider/Slider'
import { Container } from '../ui/Container/Container'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { RoutesList } from '../Router/RoutesList'
import { Link } from 'react-router-dom'

export const DraftPage = () => {
  const [distName, setDistName] = useState('')
  const {
    isLoading: isDistLoading,
    error: distError,
    data: distData,
  } = useQuery(['dist', distName], () => getDistByName(distName), {
    enabled: distName?.length > 0,
  })
  const {
    isLoading: isAssistantsLoading,
    error: assistantsError,
    data: assistantsData,
  } = useQuery('assistant_dists', getAssistantDists)

  distError && <>An error has occurred: + {distError}</>
  isAssistantsLoading && <>Loading...</>

  return (
    <>
      <Topbar />
      <Main></Main>
    </>
  )
}
