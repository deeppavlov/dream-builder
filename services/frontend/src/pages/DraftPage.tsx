import { Main } from '../components/Main/Main'
import { Topbar } from '../components/Topbar/Topbar'
import { Container } from '../ui/Container/Container'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { useQuery } from 'react-query'
import { BotCard } from '../components/BotCard/BotCard'
import { Table } from '../ui/Table/Table'
import { BotListItem } from '../components/BotListItem/BotListItem'
import { SkillCard } from '../components/SkillCard/SkilllCard'
import { getAssistantDists } from '../services/getAssistantDists'
import { getSkillList } from '../services/getSkillsList'
import { SkillListItem } from '../components/SkillListItem/SkillListItem'
import { dateToUTC } from '../utils/dateToUTC'
import { timeToUTC } from '../utils/timeToUTC'

interface dist_list {
  name: string
  metadata: {
    display_name: string
    date: string | number | Date
    author: string
    description: string
    version: string
    ram_usage: string
    gpu_usage: string
    disk_usage: string
  }
}
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

export const DraftPage = () => {
  const {
    isLoading: isAssistantsLoading,
    error: assistantsError,
    data: assistants,
  } = useQuery('assistant_dists', getAssistantDists)
  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
  } = useQuery('skills_list', getSkillList)

  if (isSkillsLoading) return 'Loading...'
  if (isAssistantsLoading) return 'Loading...'

  if (skillsError) return 'An error has occurred: ' + assistantsError
  if (assistantsError) return 'An error has occurred: ' + assistantsError

  return (
    <>
      <Topbar />
      <Main>
        <Wrapper width='100%' title='Public Skills' amount={skills.length}>
          <Container>
            {skills?.map((skill: skill_list) => {
              const date = dateToUTC(skill.metadata.date_created)
              return (
                <SkillCard
                  // key={skill.name}
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
        <Wrapper
          width='100%'
          title='Public Assistants'
          amount={assistants.length}>
          <Container>
            {assistants?.map((dist: dist_list) => {
              const date = dateToUTC(dist.metadata.date)
              return (
                <BotCard
                  key={dist.name}
                  botName={dist.metadata.display_name}
                  companyName={dist.metadata.author}
                  date={date}
                  description={dist.metadata.description}
                  version={dist.metadata.version}
                  ram={dist.metadata.ram_usage}
                  gpu={dist.metadata.gpu_usage}
                  space={dist.metadata.disk_usage}
                />
              )
            })}
          </Container>
        </Wrapper>
        <Wrapper
          width='100%'
          title='Public Assistants'
          amount={assistants.length}>
          <Table>
            {assistants?.map((dist: dist_list) => {
              const date = dateToUTC(dist.metadata.date)
              const time = timeToUTC(dist.metadata.date)
              return (
                <BotListItem
                  key={dist.name}
                  botName={dist.metadata.display_name}
                  companyName={dist.metadata.author}
                  date={date}
                  time={time}
                  description={dist.metadata.description}
                  version={dist.metadata.version}
                  ram={dist.metadata.ram_usage}
                  gpu={dist.metadata.gpu_usage}
                  space={dist.metadata.disk_usage}
                />
              )
            })}
          </Table>
        </Wrapper>
        <Wrapper width='100%' title='Public Skills' amount={skills.length}>
          <Table>
            {skills?.map((skill: skill_list) => {
              const date = dateToUTC(skill.metadata.date_created)
              const time = timeToUTC(skill.metadata.date_created)
              return (
                <SkillListItem
                  // key={skill.name}
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
      </Main>
    </>
  )
}
