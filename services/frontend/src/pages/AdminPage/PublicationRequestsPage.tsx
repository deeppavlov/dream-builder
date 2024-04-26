import { useTranslation } from 'react-i18next'
import { RotatingLines } from 'react-loader-spinner'
import { IDeploymentState } from 'types/types'
import { useAdmin, useDeploy } from 'hooks/api'
import { sortByISO8601 } from 'utils/sortByISO8601'
import { DeploymentCard, PublicationRequestCard } from 'components/Cards'
import { Container, Main, Wrapper } from 'components/UI'

function filterStack(arr: IDeploymentState[]) {
  const excludedValues = [
    'universal_prompted_assistant',
    'multiskill_ai_assistant',
    'ai_faq_assistant',
    'fashion_stylist_assistant',
    'marketing_assistant',
    'fairytale_assistant',
    'nutrition_assistant',
    'deepy_assistant',
    'life_coaching_assistant',
    'deeppavlov_assistant',
  ]
  return arr?.filter(
    obj => !excludedValues.includes(obj.virtual_assistant.name)
  )
}

export const PublicationRequestsPage = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_page' })
  const { requests } = useAdmin()
  const { deployments } = useDeploy()

  const filteredDeployment = filterStack(deployments?.data!)

  const sortedDeployment = sortByISO8601(filteredDeployment)
  const sortedRequest = sortByISO8601(requests!)
  return (
    <Main sidebar>
      <Wrapper fitScreen title={t('requests')}>
        <Container gridForRequests>
          {sortedRequest?.map((request, i: number) => (
            <PublicationRequestCard request={request} key={i} />
          ))}
        </Container>
      </Wrapper>
      <Wrapper
        fitScreen
        title={t('deployments')}
        amount={sortedDeployment?.length > 0 ? sortedDeployment?.length : ''}
      >
        {deployments?.isLoading && (
          <div
            style={{
              alignSelf: 'center',
              justifySelf: 'center',
            }}
          >
            <RotatingLines
              strokeColor='grey'
              strokeWidth='5'
              animationDuration='0.75'
              width='64'
              visible={true}
            />
          </div>
        )}
        <Container gridForDeploys>
          {sortedDeployment?.map((deployment, i: number) => (
            <DeploymentCard key={i} deployment={deployment} />
          ))}
        </Container>
      </Wrapper>
    </Main>
  )
}
