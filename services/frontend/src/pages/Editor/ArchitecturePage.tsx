import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getComponents } from 'api/components'
import {
  Annotators,
  CandidateAnnotators,
  ResponseAnnotators,
  ResponseSelector,
  SkillSelector,
  Skills,
} from 'components/Stacks'
import { Main } from 'components/UI'

const ArchitecturePage = () => {
  const { name } = useParams()
  const { data: components } = useQuery(
    ['components', name],
    () => getComponents(name!),
    {
      refetchOnWindowFocus: false,
      enabled: name?.length! > 0,
    }
  )

  const annotators = components?.annotators
  const candidateAnnotators = components?.candidate_annotators
  const skills = components?.skills
  const skillSelectors = components?.skill_selectors
  const responseSelectors = components?.response_selectors
  const responseAnnotators = components?.response_annotators

  return (
    <Main sidebar editor draggable>
      <Annotators annotators={annotators} />
      <SkillSelector skillSelectors={skillSelectors} />
      <Skills skills={skills} />
      <CandidateAnnotators candidateAnnotators={candidateAnnotators} />
      <ResponseSelector responseSelectors={responseSelectors} />
      <ResponseAnnotators responseAnnotators={responseAnnotators} />
    </Main>
  )
}

export default ArchitecturePage
