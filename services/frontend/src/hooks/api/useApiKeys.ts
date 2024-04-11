import { AxiosError } from 'axios'
import { useAuth } from 'context'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { IApiService, IModelValidationState, LM_Service } from 'types/types'
import { getAllLMservices } from 'api/components'
import { getTokens } from 'api/user'
import { validateApiKey } from 'api/user/validateApiKey'
import { trigger } from 'utils/events'
import { getApiKeysLSId, getLSApiKeys } from 'utils/getLSApiKeys'
import { isKeyRequiredForModel, saveTokens } from 'utils/localStorageTokens'

interface ICheckData {
  lmService: LM_Service
  tokenValue: string
}

export const useApiKeys = () => {
  const [validationState, setValidationState] = useState<IModelValidationState>(
    { status: 'unchecked' }
  )

  const updateLsValidationState = (
    newState: IModelValidationState,
    lmServiceName: string
  ) => {
    const newLsApiKeys = lsApiKeys.map(key => {
      if (isKeyRequiredForModel(key, lmServiceName)) {
        key.lmValidationState[lmServiceName] = newState
      }
      return key
    })
    saveTokens(localStorageName, newLsApiKeys)
    trigger('AccessTokensChanged', [])
  }

  const { user } = useAuth()
  const userId = user!.id
  const lsApiKeys = getLSApiKeys(userId) || []
  const localStorageName = getApiKeysLSId(user!.id)

  const checkApiKey = useMutation({
    mutationFn: ({ lmService, tokenValue }: ICheckData) => {
      setValidationState({ status: 'loading' })
      updateLsValidationState({ status: 'loading' }, lmService.name)
      return validateApiKey(tokenValue, lmService)
    },
    onSuccess: (_, { lmService }) => {
      const newValidationState: IModelValidationState = { status: 'valid' }
      setValidationState(newValidationState)
      updateLsValidationState(newValidationState, lmService.name)
    },
    onError: (err: AxiosError, { lmService }) => {
      const newValidationState: IModelValidationState = {
        status: 'invalid',
        message: err.response?.data?.message || err.response?.data?.detail,
      }
      setValidationState(newValidationState)
      updateLsValidationState(newValidationState, lmService.name)
    },
  })

  const apiServices = useQuery<IApiService[]>(['api_services'], () =>
    getTokens()
  )

  const lmServices = useQuery('all_lm_services', () => getAllLMservices(), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return {
    validationState,
    setValidationState,
    checkApiKey,
    apiServices,
    lmServices,
  }
}
