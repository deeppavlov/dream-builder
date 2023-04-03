import { useQuery } from 'react-query'
import { AssistantModal } from '../components/AssistantModal/AssistantModal'
import { Main } from '../components/Main/Main'
import { SkillList } from '../components/SkillList/SkillList'
import { getComponentsGroup } from '../services/getComponentsGroup'
import { Table } from '../ui/Table/Table'
import { Wrapper } from '../ui/Wrapper/Wrapper'

export const DraftPage = () => {
  const { data } = useQuery('skills', () => getComponentsGroup('skills'))
  console.log(`data = `, data)
  return (
    <>
      <Main>
        <Wrapper skills >
          <Table second='Type'>
            <SkillList skills={data} view={'table'} />
          </Table>
        </Wrapper>
      </Main>
      <AssistantModal />
    </>
  )
}
