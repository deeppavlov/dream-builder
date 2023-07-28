import store from 'store2'
import { ELOCALES_KEY } from 'types/types'
import { I18N_STORE_KEY } from 'constants/constants'

export const currentLocale: ELOCALES_KEY = store(I18N_STORE_KEY).split('-')[0]
