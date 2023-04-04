import { useQuery } from 'react-query'
import { Annotators } from '../../components/Annotators/Annotators'
import { CandidateAnnotators } from '../../components/CandidateAnnotators/CandidateAnnotators'
import { Loader } from '../../components/Loader/Loader'
import { Main } from '../../components/Main/Main'
import { ResponseAnnotators } from '../../components/ResponseAnnotators/ResponseAnnotators'
import { ResponseSelector } from '../../components/ResponseSelector/ResponseSelector'
import { SkillSelector } from '../../components/SkillSelector/SkillSelector'
import { Skills } from '../../components/Skills/Skills'
import { useParams } from 'react-router-dom'
import { getComponents } from '../../services/getComponents'

const ArchitecturePage = () => {
  const { name } = useParams()
  const {
    isLoading: isComponentsLoading,
    error: componentsError,
    data: components,
  } = useQuery(['components', name], () => getComponents(name!), {
    refetchOnWindowFocus: false,
    enabled: name?.length! > 0,
  })

  const annotators = components?.annotators
  const candidateAnnotators = components?.candidate_annotators
  const skills = components?.skills
  const skillSelectors = components?.skill_selectors
  const responseSelectors = components?.response_selectors
  const responseAnnotators = components?.response_annotators

  return (
    <Main sidebar editor draggable>
      <Loader isLoading={isComponentsLoading} />
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
