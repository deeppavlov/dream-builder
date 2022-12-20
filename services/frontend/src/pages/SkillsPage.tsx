import { useState } from 'react'
import { useQuery } from 'react-query'
import { getSkillList } from '../services/getSkillsList'
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

  if (isSkillsLoading) return 'Loading...'

  if (skillsError) return 'An error has occurred: '
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main sidebar='none'>
        {!listView ? (
          <>
            <Wrapper
              title='Public Skills'
              showAll={true}
              amount={skillsData.length}
              linkTo='/allskills'
              paddingBottom='12px'>
              <Container paddingBottom='22px'>
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
              </Container>
            </Wrapper>
            <Wrapper showAll={true} paddingBottom='12px' title='Your Skills'>
              <Container>
                <Container
                  position='sticky'
                  left='0'
                  top='0'
                  width='275px'
                  minWidth='275px'
                  paddingBottom='22px'>
                  <AddButton
                    height='330px'
                    listView={listView}
                    addBot={addBot}
                  />
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
              linkTo='/allskills'>
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
                <AddButton addBot={addBot} listView={listView} />
                {skills}
              </Table>
            </Wrapper>
          </>
        )}
      </Main>
    </>
  )
}
