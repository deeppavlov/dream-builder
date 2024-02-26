import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { ReactComponent as Attention } from 'assets/icons/attention.svg'
import { IApiService, IUserApiKey, LM_Service } from 'types/types'
import { toasts } from 'mapping/toasts'
import { getTokens, getUserId } from 'api/user'
import { useGaToken } from 'hooks/googleAnalytics/useGaToken'
import { trigger } from 'utils/events'
import { getApiKeysLSId, getLSApiKeys } from 'utils/getLSApiKeys'
import { getValidationSchema } from 'utils/getValidationSchema'
import { SkillDropboxSearch } from 'components/Dropdowns'
import { Input } from 'components/Inputs'
import { MockModal } from 'components/Modals'
import { Wrapper } from 'components/UI'
import AccessTokenKey from './AccessTokenKey/AccessTokenKey'
import s from './AccessTokensModule.module.scss'

interface FormValues {
  token: string
  service: LM_Service
}

export const AccessTokensModule = () => {
  const { t } = useTranslation()
  const { data: user } = useQuery(['user'], () => getUserId())
  const { data: api_services } = useQuery<IApiService[]>(['api_services'], () =>
    getTokens()
  )
  const [tokens, setTokens] = useState<IUserApiKey[] | null>(null)
  const { handleSubmit, reset, control, watch } = useForm<FormValues>({
    mode: 'onSubmit',
  })
  const localStorageName = getApiKeysLSId(user?.id)
  const validationSchema = getValidationSchema()
  const { openTokenModal, tokenPasted, addOrDeleteToken } = useGaToken()

  const handleChanges = () => trigger('AccessTokensChanged', {})

  const clearTokens = () => localStorage.removeItem(localStorageName)

  const saveTokens = (newState: IUserApiKey[] | null) => {
    const isTokens = newState !== null && newState?.length > 0

    if (!isTokens) return clearTokens()
    localStorage.setItem(localStorageName, JSON.stringify(newState))
  }

  const deleteToken = (token_id: number) =>
    new Promise((resolve, reject) => {
      const isTokens = tokens !== undefined && tokens !== null

      if (!isTokens)
        return reject(t('modals.access_api_keys.toasts.not_found_token'))
      setTokens(prev => {
        const newState =
          prev?.filter(({ api_service }) => api_service.id !== token_id) ?? prev

        saveTokens(newState)
        return newState
      })

      const service = api_services?.find(({ id }) => id === token_id)
      addOrDeleteToken(service?.display_name, 'delete')
      resolve(true)
    })

  const handleRemoveBtnClick = (token_id: number) => {
    toast
      .promise(deleteToken(token_id), toasts().deleteToken)
      .finally(() => handleChanges())
  }

  const updateToken = (index: number, token: IUserApiKey) =>
    new Promise(resolve => {
      setTokens(prev => {
        const isPrev = prev !== null && prev !== undefined
        const newState = isPrev ? prev : [token]

        if (!isPrev) return newState
        newState?.splice(index, 1, token)
        saveTokens(newState)
        return newState
      })
      resolve(t('modals.access_api_keys.toasts.token_updated'))
    })

  const onSubmit = () => {
    setMockIsOpen(true)
    reset()
  }

  useEffect(() => setTokens(getLSApiKeys(user?.id)), [user])

  const tokenValue = watch('token')
  useEffect(() => {
    tokenPasted(tokenValue)
  }, [tokenValue])

  useEffect(() => {
    openTokenModal()
  }, [])

  const [mockIsOpen, setMockIsOpen] = useState(false)

  return (
    <div className={s.module}>
      <div className={s.body}>
        <h5 className={s.title}>{t('modals.access_api_keys.header')}</h5>
        <p className={s.annotations}>{t('modals.access_api_keys.desc')}</p>
        <form className={s.add} onSubmit={handleSubmit(onSubmit)}>
          <Input
            name='token'
            label={t('modals.access_api_keys.token_field.label')}
            control={control}
            withEnterButton
            rules={{ required: validationSchema.globals.required }}
            props={{
              placeholder: t('modals.access_api_keys.token_field.placeholder'),
            }}
          />
          <SkillDropboxSearch
            name='service'
            label={t('modals.access_api_keys.service_dropbox.label')}
            list={
              api_services?.map(s => ({
                id: s.id.toString(),
                name: s.name,
                display_name: s.display_name,
              })) || []
            }
            control={control}
            rules={{ required: true }}
            props={{
              placeholder: t(
                'modals.access_api_keys.service_dropbox.placeholder'
              ),
            }}
            withoutSearch
          />
        </form>
        {tokens && (
          <ul className={s.tokens}>
            {tokens.map((key: IUserApiKey, index) => (
              <AccessTokenKey
                removeApiKey={handleRemoveBtnClick}
                updateApiKey={newToken => {
                  updateToken(index, newToken)
                }}
                apiKey={key}
                key={key.id}
              />
            ))}
          </ul>
        )}
      </div>
      <div className={s.footer}>
        <Wrapper>
          <div className={s.container}>
            <div className={s.attention}>
              <Attention />
            </div>
            <div className={s.annotation}>
              {t('modals.access_api_keys.attention.annotation.first_line')}
              <br />
              {t('modals.access_api_keys.attention.annotation.second_line')}
            </div>
          </div>
        </Wrapper>
      </div>
      <MockModal isOpenModal={mockIsOpen} setIsOpenMock={setMockIsOpen} />
    </div>
  )
}
