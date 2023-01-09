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
import { SkillCard } from '../components/SkillCard/SkillCard'

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

      <Main>
        {assistantsData && (
          <Wrapper>
            <Container>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                }}>
                {assistantsData?.map(dist => {
                  return (
                    <button
                      key={dist?.name}
                      style={{
                        backgroundColor: 'lightgrey',
                        padding: '12px',
                        borderRadius: '8px',
                      }}
                      onClick={e => {
                        e.preventDefault()
                        setDistName(dist?.name)
                      }}>
                      {dist?.name}
                    </button>
                  )
                })}
              </div>
            </Container>
          </Wrapper>
        )}
        {distData && (
          <Container flexDirection='column'>
            <Wrapper>
              <Link to={RoutesList.editor + `${distData?.name}`}>
                <h3>{distData?.name}</h3>
              </Link>
            </Wrapper>
            <Container flexDirection='row'>
              <Wrapper>
                {isDistLoading && 'Loading...'}
                <h4>Annotators</h4>
                {distData?.pipeline_conf?.services?.annotators
                  ? Object.keys(
                      distData?.pipeline_conf?.services?.annotators
                    ).map(i => {
                      return <p>{i}</p>
                    })
                  : 'null'}
              </Wrapper>
              <Wrapper>
                {isDistLoading && 'Loading...'}
                <h4>Skill Selectors</h4>
                {distData?.pipeline_conf?.services?.skill_selectors
                  ? Object.keys(
                      distData?.pipeline_conf?.services?.skill_selectors
                    ).map(i => {
                      return <p>{i}</p>
                    })
                  : 'null'}
              </Wrapper>
              <Wrapper>
                {isDistLoading && 'Loading...'}
                <h4>Skills</h4>
                {distData?.pipeline_conf?.services?.skills
                  ? Object.keys(distData?.pipeline_conf?.services?.skills).map(
                      i => {
                        return <p>{i}</p>
                      }
                    )
                  : 'null'}
              </Wrapper>
              <Wrapper>
                {isDistLoading && 'Loading...'}
                <h4>Response Selectors</h4>
                {distData?.pipeline_conf?.services?.response_selectors
                  ? Object.keys(
                      distData?.pipeline_conf?.services?.response_selectors
                    ).map(i => {
                      return <p>{i}</p>
                    })
                  : 'null'}
              </Wrapper>
              <Wrapper>
                {isDistLoading && 'Loading...'}
                <h4>Response Annotators</h4>
                {distData?.pipeline_conf?.services?.response_annotators
                  ? Object.keys(
                      distData?.pipeline_conf?.services?.response_annotators
                    )?.map(i => {
                      return <p>{i}</p>
                    })
                  : 'null'}
              </Wrapper>
            </Container>
          </Container>
        )}
      </Main>
    </>
  )
}
