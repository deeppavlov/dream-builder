import { useState } from 'react'
import { useQuery } from 'react-query'
import ReactTooltip from 'react-tooltip'
import { getSkillList } from '../services/getSkillsList'
import { useAuth } from '../services/AuthProvider'
import { AddButton } from '../ui/AddButton/AddButton'
import { Container } from '../ui/Container/Container'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { Table } from '../ui/Table/Table'
import { dateToUTC } from '../utils/dateToUTC'
import { timeToUTC } from '../utils/timeToUTC'
import { SkillCard } from '../components/SkillCard/SkilllCard'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { SkillInBotCard } from '../components/SkillInBotCard/SkillInBotCard'
import { RoutesList } from '../Router/RoutesList'
import { Slider } from '../ui/Slider/Slider'
interface skill_list {
  name: string
  metadata: {
    execution_time: any
    date_created: string | number | Date
    author: string
    type: string
    description: string
    version: string
    ram_usage: string
    gpu_usage: string
    time: string
    display_name: string
  }
}

export const SkillsPage = () => {
  const auth = useAuth()
  const [listView, setListView] = useState(false)
  const viewHandler = () => {
    console.log('view has changed')
    setListView(!listView)
    setSkills([])
    console.log(listView)
  }
  const [skills, setSkills] = useState([])
  const addBot = () => {
    !listView
      ? setSkills(skills.concat(<SkillInBotCard />))
      : setSkills(skills.concat(<SkillListItem />))
  }

  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skillsData,
  } = useQuery('skills_list', getSkillList)

  if (isSkillsLoading) return <>Loading...</>

  if (skillsError) return <>An error has occurred: + {skillsError}</>
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main>
        {!listView ? (
          <>
            <Wrapper
              title='Public Skills'
              amount={skillsData.length}
              linkTo={RoutesList.skillsAll}
              showAll>
              <Container>
                <Slider>
                  {skillsData?.map((skill: skill_list) => {
                    const date = dateToUTC(skill.metadata.date_created)
                    return (
                      <SkillCard
                        skillName={skill.metadata.display_name}
                        companyName={skill.metadata.author}
                        skillType={skill.metadata.type}
                        date={date}
                        description={skill.metadata.description}
                        version={skill.metadata.version}
                        ram={skill.metadata.ram_usage}
                        gpu={skill.metadata.gpu_usage}
                        time={skill.metadata.execution_time}
                        executionTime={skill.metadata.execution_time}
                      />
                    )
                  })}
                </Slider>
              </Container>
            </Wrapper>
            <Wrapper showAll title='Your Skills'>
              <Container>
                <Container
                  position='sticky'
                  left='0'
                  top='0'
                  width='275px'
                  minWidth='275px'
                  paddingBottom='22px'>
                  <div data-tip data-for='add-btn-new-bot'>
                    <AddButton
                      height='330px'
                      listView={listView}
                      addBot={addBot}
                      disabled={auth?.user === null}
                    />
                  </div>
                </Container>
                <Container>{skills}</Container>
              </Container>
            </Wrapper>
          </>
        ) : (
          <>
            <Wrapper
              title='Public Skills'
              showAll
              amount={skillsData.length}
              linkTo={RoutesList.skillsAll}>
              <Table second='Type'>
                {skillsData?.map((skill: skill_list) => {
                  const date = dateToUTC(skill.metadata.date_created)
                  const time = timeToUTC(skill.metadata.date_created)
                  return (
                    <SkillListItem
                      skillName={skill.metadata.display_name}
                      companyName={skill.metadata.author}
                      date={date}
                      time={time}
                      description={skill.metadata.description}
                      version={skill.metadata.version}
                      ram={skill.metadata.ram_usage}
                      gpu={skill.metadata.gpu_usage}
                      executionTime={skill.metadata.execution_time}
                      skillType={skill.metadata.type}
                      botName={''}
                    />
                  )
                })}
              </Table>
            </Wrapper>
            <Wrapper title='Your Virtual Assistants & Chatbots'>
              <Table>
                <AddButton
                  addBot={addBot}
                  listView={listView}
                  disabled={auth?.user === null}
                />
                {skills}
              </Table>
            </Wrapper>
          </>
        )}
        {auth?.user === null && (
          <ReactTooltip
            place='bottom'
            effect='solid'
            className='tooltips'
            arrowColor='#8d96b5'
            delayShow={1000}
            id='add-btn-new-bot'>
            You must be signed in to create the own skill
          </ReactTooltip>
        )}
      </Main>
    </>
  )
}
