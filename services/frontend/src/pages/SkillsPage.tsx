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
import { SkillCard } from '../components/SkillCard/SkillCard'
import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
// import { SkillInBotCard } from '../components/SkillInBotCard/SkillInBotCard'
import { RoutesList } from '../Router/RoutesList'
import { Slider } from '../ui/Slider/Slider'
import SkillSidePanel from '../components/SkillSidePanel/SkillSidePanel'
import { SkillType } from '../types/types'
import { nanoid } from 'nanoid'
import { CreateSkillModal } from '../components/CreateSkillModal/CreateSkillModal'

interface skill_list {
  assistant_dist: string
  name: string
  metadata: {
    execution_time: any
    date_created: string | number | Date
    author: string
    type: SkillType
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
  const [listView, setListView] = useState<boolean>(false)
  const viewHandler = () => {
    setListView(listView => !listView)
    setSkills([])
  }
  const [skills, setSkills] = useState<JSX.Element[]>([])
  const addBot = () => {
    !listView
      ? setSkills(
          skills.concat([
            <SkillCard
              key={nanoid(8)}
              type='your'
              name='Name of The Skill'
              skillType='fallbacks'
              botName='Name of The Bot'
              desc='Helps users locate the nearest store. And we can write 3 lines here and this is maximum about skill info infoinfo'
              dateCreated={dateToUTC(new Date())}
              version='0.01'
              ram='0.0 GB'
              gpu='0.0 GB'
              executionTime='0.0 ms'
            />,
          ])
        )
      : setSkills(
          skills.concat([
            <SkillListItem
              key={nanoid(8)}
              name='Name of The Skill'
              desc='Helps users locate the nearest store. And we can write 3 lines
              here and this is maximum about'
              author={auth?.user?.name ?? ''}
              skillType='retrieval'
              version='0.01'
              dateCreated={dateToUTC(new Date())}
              time={timeToUTC(new Date().getTime())}
              ram='0.0 GB'
              gpu='0.0 GB'
              executionTime='0.0 ms'
              disabledMsg={
                auth?.user
                  ? undefined
                  : 'You must be signed in to add the skill'
              }
            />,
          ])
        )
  }

  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skillsData,
  } = useQuery('skills_list', getSkillList)

  skillsError && <>{'An error has occurred:' + { skillsError }}</>
 console.log(skillsData)
  return (
    <>
      <Topbar viewHandler={viewHandler} type='main' />
      <Main>
        {!listView ? (
          <>
            <Wrapper
              title='Public Skills'
              amount={skillsData?.length}
              linkTo={RoutesList.skillsAll}
              showAll>
              <Container>
                <Slider>
                  {skillsData?.map((skill: skill_list, i: number) => {
                    const {
                      display_name,
                      type,
                      description,
                      version,
                      ram_usage,
                      gpu_usage,
                      execution_time,
                      date_created,
                    } = skill?.metadata
                    const date = dateToUTC(date_created)
                    isSkillsLoading && <>{'Loading...'}</>
                    return (
                      <SkillCard
                        key={i}
                        name={display_name}
                        author={skill.assistant_dist}
                        skillType={type}
                        dateCreated={date}
                        desc={description}
                        version={version}
                        ram={ram_usage}
                        gpu={gpu_usage}
                        executionTime={execution_time}
                        disabledMsg={
                          auth?.user
                            ? undefined
                            : 'You must be signed in to add the skill'
                        }
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
                  width='280px'
                  minWidth='280px'
                  paddingBottom='22px'>
                  <div data-tip data-for='add-btn-new-bot'>
                    <AddButton
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
              amount={skillsData?.length}
              linkTo={RoutesList.skillsAll}
              showAll
              fitScreen>
              <Table second='Type'>
                {skillsData?.map((skill: skill_list, i: number) => {
                  const {
                    display_name,
                    type,
                    description,
                    version,
                    ram_usage,
                    gpu_usage,
                    execution_time,
                    date_created,
                  } = skill.metadata
                  const date = dateToUTC(date_created)
                  const time = timeToUTC(date_created)
                  return (
                    <SkillListItem
                      key={i}
                      name={display_name}
                      author={skill?.assistant_dist}
                      dateCreated={date}
                      time={time}
                      desc={description}
                      version={version}
                      ram={ram_usage}
                      gpu={gpu_usage}
                      executionTime={execution_time}
                      skillType={type}
                      disabledMsg={
                        auth?.user
                          ? undefined
                          : 'You must be signed in to add the skill'
                      }
                    />
                  )
                })}
              </Table>
            </Wrapper>
            <Wrapper title='Your Virtual Assistants & Chatbots' limiter>
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
            You must be signed in to create your own skill
          </ReactTooltip>
        )}

        <SkillSidePanel
          disabledMsg={
            auth?.user ? undefined : 'You must be signed in to add the skill'
          }
          position={{ top: 64 }}
        />

        <CreateSkillModal />
      </Main>
    </>
  )
}
